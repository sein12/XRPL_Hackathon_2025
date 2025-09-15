import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

export default function ProductTeaser({ product }: { product: Product }) {
  return (
    <Link to={`/dashboard/products/${product.id}`}>
      <div className="flex flex-col gap-1 rounded-md border border-gray-300 shadow-md px-4 py-3">
        <div className="text-sm leading-[21px] tracking-[-0.25px] line-clamp-1">
          {product.name}
        </div>
        <div className="text-xs text-gray-400">{product.coverageSummary}</div>
      </div>
    </Link>
  );
}
