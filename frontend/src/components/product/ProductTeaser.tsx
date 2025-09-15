import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

export default function ProductTeaser({ product }: { product: Product }) {
  return (
    <Link to={`/dashboard/products/${product.id}`}>
      <div className="rounded-lg border border-[rgba(198,198,198,0.98)] shadow-[0_0_4px_rgba(0,0,0,0.25)] bg-white px-4 py-3">
        <div className="text-[14px] leading-[21px] tracking-[-0.25px] line-clamp-1">
          {product.name || "어떤 보험을 들어야 잘 들었다고..."}
        </div>
        <div className="text-[12px] leading-[21px] text-[#999] tracking-[-0.25px] line-clamp-1">
          {product.coverageSummary || "어떤 보험을 들어야 잘 들었다고..."}
        </div>
      </div>
    </Link>
  );
}
