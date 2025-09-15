export type PolicyStatus = "ACTIVE" | "PAID" | "EXPIRED";

export type Policy = {
  id: string;
  status: PolicyStatus;
  createdAt: string;
  // 백엔드에서 include로 product 최소 정보 동봉 권장
  product?: { id: string; name: string } | null;
};
