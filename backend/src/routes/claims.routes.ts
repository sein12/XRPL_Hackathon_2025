// src/routes/claims.routes.ts
import { Router } from "express";
import { prisma } from "../repositories/prisma";
import {
  ClaimStatus,
  Prisma,
  AiDecision as PrismaAiDecision,
} from "@prisma/client";
import { authGuard, AuthedRequest } from "../middlewares/authGuard";
// import { evaluateOCR } from "../services/ai.service";
import { saveUploadedFile } from "../services/storage.service";
import { parse } from "date-fns";

// ✅ express-fileupload 타입
import type { UploadedFile } from "express-fileupload";

export const claimRouter = Router();
claimRouter.use(authGuard);

// 요청 바디에 정확한 타입 지정
type CreateClaimBody = {
  policyId?: string;
  incidentDate?: string;
  details?: string;
  rejectedReason?: string;
  aiDecision?: string; // 그대로 문자열
};

const ALLOWED_MIME = new Set(["application/pdf", "image/png", "image/jpeg"]);

function parseIncidentDate(input?: string): Date | null {
  if (!input) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const dt = parse(input, "yyyy-MM-dd", new Date());
    return Number.isNaN(dt.getTime()) ? null : dt;
  }
  const dt = new Date(input);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

/** ================= DTO ================= */
type ClaimRow = Prisma.ClaimGetPayload<{
  include: { policy: { include: { product: true } } };
}>;

type ClaimDTO = {
  id: string;
  policyId: string;
  status: keyof typeof ClaimStatus;
  incidentDate: string; // ISO
  details: string;
  evidenceUrl: string;
  aiDecision?: string | null;
  aiRaw?: unknown;
  payoutAt?: string | null;
  payoutTxHash?: string | null;
  payoutMeta?: unknown;
  createdAt: string;
  updatedAt: string;
  productDescriptionMd: string;
  payoutDropsSnapshot: string;
};

function toClaimDTO(row: ClaimRow): ClaimDTO {
  return {
    id: row.id,
    policyId: row.policyId,
    status: row.status,
    incidentDate: row.incidentDate.toISOString(),
    details: row.details,
    evidenceUrl: row.evidenceUrl,
    aiDecision: row.aiDecision ?? null, // 그대로 문자열
    aiRaw: row.aiRaw ?? undefined,
    payoutAt: row.payoutAt ? row.payoutAt.toISOString() : null,
    payoutTxHash: row.payoutTxHash ?? null,
    payoutMeta: row.payoutMeta ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    productDescriptionMd: row.productDescriptionMd,
    payoutDropsSnapshot: row.payoutDropsSnapshot.toString(),
  };
}

/** ============== Routes ============== */

// 목록
claimRouter.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const items = await prisma.claim.findMany({
      where: { policy: { userId } },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { policy: { include: { product: true } } },
    });
    res.json({ items: items.map(toClaimDTO), nextCursor: null });
  } catch (e) {
    next(e);
  }
});

// 생성 (파트너/AI 주석: 생성만 확인)
claimRouter.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const { policyId, incidentDate, details, rejectedReason, aiDecision } =
      req.body as CreateClaimBody;

    // 필수 값 검증은 그대로 유지
    if (!policyId) return res.status(400).json({ error: "policyId required" });
    if (!incidentDate)
      return res.status(400).json({ error: "incidentDate required" });
    if (!details || !details.trim())
      return res.status(400).json({ error: "details required" });
    if (!aiDecision)
      return res.status(400).json({ error: "aiDecision required" });

    // 파일 검증/저장 동일
    const input = (req.files as any)?.file as
      | UploadedFile
      | UploadedFile[]
      | undefined;
    const file: UploadedFile | undefined = Array.isArray(input)
      ? input[0]
      : input;
    if (!file) return res.status(400).json({ error: "file required" });
    if (file.mimetype && !ALLOWED_MIME.has(file.mimetype)) {
      return res.status(400).json({ error: "unsupported file type" });
    }

    const policy = await prisma.policy.findFirst({
      where: { id: policyId, userId },
      include: { product: true },
    });
    if (!policy) return res.status(404).json({ error: "Policy not found" });

    const incidentAt = parseIncidentDate(incidentDate);
    if (!incidentAt)
      return res.status(400).json({ error: "Invalid incidentDate" });

    const evidenceUrl = await saveUploadedFile(file);

    // ✅ aiDecision을 문자열 그대로 저장
    const created = await prisma.claim.create({
      data: {
        policyId,
        evidenceUrl,
        incidentDate: incidentAt,
        details,
        productDescriptionMd: policy.product.descriptionMd,
        payoutDropsSnapshot: policy.product.payoutDrops,
        aiDecision, // 그대로
        rejectedReason: rejectedReason?.trim() || null,
      },
      select: { id: true },
    });

    res.status(201).json({ claimId: created.id, status: "SUBMITTED" });
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
      include: { policy: { include: { product: true } } },
    });
    if (!c || c.policy.userId !== userId)
      return res.status(404).json({ error: "Not found" });

    res.json(toClaimDTO(c));
  } catch (e) {
    next(e);
  }
});
