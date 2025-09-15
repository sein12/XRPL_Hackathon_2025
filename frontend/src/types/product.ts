// 서버 JSON에서 BigInt는 string으로 내려오므로 string으로 고정
export type FeatureItem = { title: string; body: string };

export type Product = {
  id: string;
  name: string;
  premiumDrops: string; // "5000000" 같은 문자열
  coverageSummary?: string | null;
  shortDescription?: string | null;
  descriptionMd?: string | null;
  features?: FeatureItem[] | null;
  active: boolean;
  createdAt: string; // ISO string
};

// 정책 응답에 포함되는 요약 형태 (백엔드 DTO와 동일 필드만 유지)
export type ProductBrief = Pick<
  Product,
  | "id"
  | "name"
  | "premiumDrops"
  | "coverageSummary"
  | "shortDescription"
  | "active"
  | "createdAt"
>;
