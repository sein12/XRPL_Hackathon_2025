// src/api/claim.ts
import { api } from "./axios";
import type { Policy } from "@/types/contract";
import type { AxiosProgressEvent } from "axios"; // ✅ 추가

export type AiDecision = "approve" | "reject" | "manual";
export type ClaimStatus =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "PAID"
  | "MANUAL";

export interface Claim {
  id: string;
  policyId: string;
  status: ClaimStatus;
  evidenceUrl: string;
  aiScore?: number | null;
  aiDecision?: AiDecision | null;
  aiRaw?: unknown;
  payoutAt?: string | null;
  payoutTxHash?: string | null;
  payoutMeta?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface ClaimListResponse {
  items: Claim[];
  nextCursor: string | null;
}

export interface ClaimDetail extends Claim {
  policy: Policy;
}

export interface CreateClaimResponse {
  claimId: string;
  status: Exclude<ClaimStatus, "SUBMITTED">;
  ai: {
    decision: AiDecision;
    score: number;
    [k: string]: unknown;
  };
}

/* ====== API functions ====== */

// 목록
export async function fetchClaims(): Promise<ClaimListResponse> {
  const { data } = await api.get<ClaimListResponse>("/claims");
  return data;
}

// 상세
export async function fetchClaim(id: string): Promise<ClaimDetail> {
  const { data } = await api.get<ClaimDetail>(`/claims/${id}`);
  return data;
}

// 생성 (policyId + file)
export async function createClaim(
  policyId: string,
  file: File,
  opts?: { onUploadProgress?: (p: AxiosProgressEvent) => void } // ✅ 수정
): Promise<CreateClaimResponse> {
  const form = new FormData();
  form.append("policyId", policyId);
  form.append("file", file); // 백엔드 필드명: 'file'

  const { data } = await api.post<CreateClaimResponse>("/claims", form, {
    // 헤더는 생략해도 FormData 경계 자동 설정됨
    onUploadProgress: opts?.onUploadProgress,
  });
  return data;
}

// 이미 만든 FormData를 쓰고 싶을 때
export async function createClaimWithFormData(
  form: FormData,
  opts?: { onUploadProgress?: (p: AxiosProgressEvent) => void } // ✅ 수정
): Promise<CreateClaimResponse> {
  const { data } = await api.post<CreateClaimResponse>("/claims", form, {
    onUploadProgress: opts?.onUploadProgress,
  });
  return data;
}
