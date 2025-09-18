// src/routes/policies.routes.ts
import { Router } from "express";
import { prisma } from "../repositories/prisma";
import { authGuard, AuthedRequest } from "../middlewares/authGuard";
import type {
  Prisma,
  Policy as PolicyModel,
  Product as ProductModel,
  PolicyStatus,
} from "@prisma/client";

export const policyRouter = Router();
policyRouter.use(authGuard);

// TODO: 굳이 Brief로 안 하고 Product로 처리해서 다 처리할 수 있게
// DTO들
type ProductBriefDTO = {
  id: string;
  name: string;
  premiumDrops: string; // BigInt → string
  coverageSummary: string | null;
  shortDescription: string | null;
  active: boolean;
  createdAt: Date;
};

type PolicyDTO = PolicyModel & { product: ProductBriefDTO | null };

type UserBriefDTO = { id: string; name: string };
type PolicyDetailDTO = PolicyModel & {
  product: ProductBriefDTO | null;
  user: UserBriefDTO;
};

// Prisma 반환 타입 (product 풀 포함)
type PolicyRow = Prisma.PolicyGetPayload<{
  include: { product: true; user: { select: { id: true; name: true } } };
}>;
type PolicyRowDetail = Prisma.PolicyGetPayload<{
  include: { product: true; user: { select: { id: true; name: true } } };
}>;

function toProductBriefDTO(p: ProductModel | null): ProductBriefDTO | null {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    premiumDrops: p.premiumDrops.toString(), // 핵심: BigInt 직렬화
    coverageSummary: p.coverageSummary ?? null,
    shortDescription: p.shortDescription ?? null,
    active: p.active,
    createdAt: p.createdAt,
  };
}

function toPolicyDTO(row: PolicyRowDetail): PolicyDetailDTO {
  return {
    ...(row as PolicyModel),
    product: toProductBriefDTO(row.product),
    user: { id: row.user.id, name: row.user.name },
  };
}

// 생성
policyRouter.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const { productId } = req.body as { productId?: string };
    if (!productId)
      return res.status(400).json({ error: "productId required" });

    const policy = await prisma.policy.create({ data: { userId, productId } });
    res.status(201).json(policy);
  } catch (e) {
    next(e);
  }
});

// 리스트
policyRouter.get("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;

    const statusParam = (req.query.status as string | undefined)?.trim();
    const statuses = statusParam
      ? (statusParam
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean) as PolicyStatus[])
      : undefined;

    const take = Math.min(
      Math.max(parseInt(String(req.query.take ?? "20"), 10) || 20, 1),
      100
    );
    const skip = Math.max(parseInt(String(req.query.skip ?? "0"), 10) || 0, 0);

    const rows: PolicyRow[] = await prisma.policy.findMany({
      where: { userId, ...(statuses ? { status: { in: statuses } } : {}) },
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: {
        product: true,
        user: { select: { id: true, name: true } },
      },
    });

    const safe = rows.map(toPolicyDTO);
    res.json(safe);
  } catch (e) {
    next(e);
  }
});

// 단건
policyRouter.get("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "id required" });

    const row = await prisma.policy.findUnique({
      where: { id },
      include: {
        product: true,
        user: { select: { id: true, name: true } },
      },
    });

    if (!row || row.userId !== userId)
      return res.status(404).json({ error: "Not found" });

    res.json(toPolicyDTO(row as PolicyRowDetail));
  } catch (e) {
    next(e);
  }
});
