import { api } from "./axios";
import type { Policy } from "@/types/contract";

export async function fetchMyPolicies(): Promise<Policy[]> {
  // 일반적으로 GET /policies 가 자신의 폴리시를 반환(인증 필요)
  const res = await api.get("/policies");
  return Array.isArray(res.data) ? res.data : res.data.items ?? [];
}

export async function createPolicy(productId: string): Promise<Policy> {
  const { data } = await api.post("/policies", { productId });
  return data.policy as Policy;
}
