// src/routes/claims.routes.ts (파일명은 기존과 동일하게)
import { Router } from "express";
import { prisma } from "../repositories/prisma";
import { ClaimStatus } from "@prisma/client";
import { authGuard, AuthedRequest } from "../middlewares/authGuard";
import { evaluateOCR } from "../services/ai.service";
import { saveUploadedFile } from "../services/storage.service";
import { parse } from "date-fns";

export const claimRouter = Router();
claimRouter.use(authGuard);

type CreateClaimBody = {
  policyId?: string;
  incidentDate?: string; // yyyy-MM-dd 혹은 ISO 문자열
  details?: string;
};

const ALLOWED_MIME = new Set(["application/pdf", "image/png", "image/jpeg"]);

function parseIncidentDate(input?: string): Date | null {
  if (!input) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const dt = parse(input, "yyyy-MM-dd", new Date()); // 로컬 타임 기준
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(input);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

// 목록
claimRouter.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const items = await prisma.claim.findMany({
      where: { policy: { userId } },
      orderBy: { createdAt: "desc" },
      take: 50,
      // 필요하면 select로 필드 제한 가능
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
    const { policyId, incidentDate, details } = req.body as CreateClaimBody;
    const file = (req.files as any)?.file;

    // 필수값 검증
    if (!policyId) return res.status(400).json({ error: "policyId required" });
    if (!incidentDate)
      return res.status(400).json({ error: "incidentDate required" });
    if (!details || !details.trim())
      return res.status(400).json({ error: "details required" });
    if (!file) return res.status(400).json({ error: "file required" });

    // 정책 소유권 확인
    const policy = await prisma.policy.findFirst({
      where: { id: policyId, userId },
      include: { user: true },
    });
    if (!policy) return res.status(404).json({ error: "Policy not found" });

    // 날짜 파싱 (yyyy-MM-dd 안전 처리)
    const incidentAt = parseIncidentDate(incidentDate);
    if (!incidentAt)
      return res.status(400).json({ error: "Invalid incidentDate" });

    // 파일 검증(선택)
    const mimetype: string | undefined = file.mimetype || file.type;
    if (mimetype && !ALLOWED_MIME.has(mimetype)) {
      return res.status(400).json({ error: "unsupported file type" });
    }

    // 저장 후 URL 획득
    const evidenceUrl = await saveUploadedFile(file);

    // 청구 생성 (필수 컬럼 포함)
    const created = await prisma.claim.create({
      data: {
        policyId,
        evidenceUrl,
        incidentDate: incidentAt,
        details,
        // status는 default: SUBMITTED
      },
      select: { id: true },
    });

    // AI 판독
    const ai = await evaluateOCR({
      claimId: created.id,
      imageUrl: evidenceUrl,
    });
    const approved = ai.decision === "approve" && ai.score >= 0.8;

    const newStatus: ClaimStatus = approved
      ? ClaimStatus.APPROVED
      : ai.decision === "reject"
      ? ClaimStatus.REJECTED
      : ClaimStatus.MANUAL;

    await prisma.claim.update({
      where: { id: created.id },
      data: {
        aiDecision: ai.decision as any,
        aiRaw: ai as any, // 원문 보관(선택)
        status: newStatus,
      },
    });

    // 지급은 파트너 서비스가 처리(동기 호출 or 웹훅)
    res.status(201).json({
      claimId: created.id,
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
