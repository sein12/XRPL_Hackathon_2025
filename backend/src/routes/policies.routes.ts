import { Router } from "express";
import { prisma } from "../repositories/prisma";
import { authGuard, AuthedRequest } from "../middlewares/authGuard";

export const policyRouter = Router();
policyRouter.use(authGuard);

// Policy 생성
policyRouter.post("/", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const { productId } = req.body as { productId?: string };
    if (!productId)
      return res.status(400).json({ error: "productId required" });

    const policy = await prisma.policy.create({
      data: { userId, productId },
    });
    res.status(201).json(policy);
  } catch (e) {
    next(e);
  }
});

// 단건 조회(소유자 검증)
policyRouter.get("/:id", async (req: AuthedRequest, res, next) => {
  try {
    const userId = req.user!.sub;
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "id required" });

    const one = await prisma.policy.findUnique({
      where: { id },
    });
    if (!one || one.userId !== userId)
      return res.status(404).json({ error: "Not found" });

    res.json(one);
  } catch (e) {
    next(e);
  }
});
