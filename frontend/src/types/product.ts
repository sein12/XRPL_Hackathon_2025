export type Product = {
  id: string;
  name: string;
  premiumDrops: string | number; // BigInt 직렬화 대응
  coverageSummary?: string | null;
  active: boolean;
  createdAt: string;
};
