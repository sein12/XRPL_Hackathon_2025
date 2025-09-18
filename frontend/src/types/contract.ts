import type { ProductBrief } from "./product";

export type PolicyStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export type User = {
  id: string;
  name: string;
};

// POST /policies는 product가 없고,
// GET /policies, /policies/:id는 product(brief)가 옴 → optional | null 로 통일
export type Policy = {
  id: string;
  userId: string;
  productId: string;
  status: PolicyStatus;

  premiumPaidAt?: string | null;
  premiumTxHash?: string | null;
  startAt?: string | null;
  expireAt?: string | null;

  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // 리스트/단건에서는 채워지고, 생성 직후 응답 등에서는 undefined/null일 수 있음
  product?: ProductBrief | null;
  user?: User;
};

// (선택) 타입 가드: product가 있는지 쉽게 판별
export function hasProduct(p: Policy): p is Policy & { product: ProductBrief } {
  return !!p.product;
}

export type PolicyDetail = Policy & {
  user: { id: string; name: string };
};
