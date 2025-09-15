// src/routes/products.routes.ts
import { Router } from "express";
import { prisma } from "../repositories/prisma";
import { authGuard } from "../middlewares/authGuard";

export const productRouter = Router();
productRouter.use(authGuard);

productRouter.get("/", async (_req, res, next) => {
  try {
    const list = await prisma.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(list);
  } catch (e) {
    next(e);
  }
});

productRouter.get("/:id", async (req, res, next) => {
  try {
    const p = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json(p);
  } catch (e) {
    next(e);
  }
});
