import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

export default function ProductListItem({
  product,
  categoryLabel,
}: {
  product: Product;
  categoryLabel?: string;
}) {
  const category = categoryLabel ?? "일반 / 의료";
  const subtitle =
    product.coverageSummary ??
    "갑작스러운 치통이나 충치, 응급 치과 진료가 필요한 경우, 간단한 영수증 제출만으로 자동 보장을 받을 수 있는 소액 진료 보험입니다.";

  return (
    <Link to={`/dashboard/products/${product.id}`} className="block">
      {/* 카드: 335px 너비, 12/16 패딩, 8px 라운드, 연한 테두리 + 약한 섀도 */}
      <div className="w-[335px] box-border rounded-lg border border-[rgba(198,198,198,0.98)] shadow-[0_0_4px_rgba(0,0,0,0.25)] bg-white px-4 py-3">
        {/* 카테고리 라벨 (12px / #999) */}
        <div className="text-[12px] leading-5 tracking-[-0.25px] text-[#999]">
          {category}
        </div>

        {/* 제목 (14px, 150%) */}
        <div className="mt-1 text-[14px] leading-[21px] tracking-[-0.25px] text-black font-normal">
          {product.name}
        </div>

        {/* 설명 (12px, 18px line-height, 2줄 클램프) */}
        <div className="mt-1 text-[12px] leading-[18px] tracking-[-0.25px] text-[#999] line-clamp-2">
          {subtitle}
        </div>
      </div>
    </Link>
  );
}
