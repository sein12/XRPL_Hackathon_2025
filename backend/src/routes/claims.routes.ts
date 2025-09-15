import { Router } from "express";
import { prisma } from "../repositories/prisma";
import { ClaimStatus } from "@prisma/client";
import { authGuard, AuthedRequest } from "../middlewares/authGuard";
import { evaluateOCR } from "../services/ai.service";
import { saveUploadedFile } from "../services/storage.service";

export const claimRouter = Router();
claimRouter.use(authGuard);

// 목록
claimRouter.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const items = await prisma.claim.findMany({
      where: { policy: { userId } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json({ items, nextCursor: null });
  } catch (e) {
    next(e);
  }
});

// 생성 + AI 평가 (지급은 파트너 시스템이 처리)
claimRouter.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const { policyId } = req.body as { policyId?: string };
    const file = (req.files as any)?.file;

    if (!policyId) return res.status(400).json({ error: "policyId required" });
    if (!file) return res.status(400).json({ error: "file required" });

    const policy = await prisma.policy.findFirst({
      where: { id: policyId, userId },
      include: { user: true },
    });
    if (!policy) return res.status(404).json({ error: "Policy not found" });

    const evidenceUrl = await saveUploadedFile(file);
    const claim = await prisma.claim.create({
      data: { policyId, evidenceUrl },
      select: { id: true },
    });

    // AI 판독
    const ai = await evaluateOCR({ claimId: claim.id, imageUrl: evidenceUrl });
    const approved = ai.decision === "approve" && ai.score >= 0.8;

    const newStatus: ClaimStatus = approved
      ? ClaimStatus.APPROVED
      : ai.decision === "reject"
      ? ClaimStatus.REJECTED
      : ClaimStatus.MANUAL;

    await prisma.claim.update({
      where: { id: claim.id },
      data: {
        aiDecision: ai.decision as any,
        aiScore: ai.score,
        aiRaw: ai as any, // 원문 보관(선택)
        status: newStatus,
      },
    });

    // 지급은 파트너 서비스가 처리(동기 호출 or 웹훅)
    // - 동기 호출을 할 거면 여기에서 파트너 API 호출 후 txHash 저장
    // - 웹훅 방식이면 여기서 끝, 웹훅에서 PAID로 갱신

    res.status(201).json({
      claimId: claim.id,
      status: newStatus, // "APPROVED" | "REJECTED" | "MANUAL"
      ai,
    });
  } catch (e) {
    next(e);
  }
});

// 상세
claimRouter.get("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "id required" });

    const c = await prisma.claim.findUnique({
      where: { id },
      include: { policy: true },
    });
    if (!c || c.policy.userId !== userId)
      return res.status(404).json({ error: "Not found" });

    res.json(c);
  } catch (e) {
    next(e);
  }
});
