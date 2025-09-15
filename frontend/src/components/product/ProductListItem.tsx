import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

export default function ProductListItem({ product }: { product: Product }) {
  return (
    <Link to={`/dashboard/products/${product.id}`} className="w-full">
      <div className="flex flex-col gap-1 rounded-md border border-gray-300 shadow-md px-4 py-3">
        <div className="text-xs text-gray-400">{product.category}</div>
        <div className="flex flex-col gap-0.5">
          <div className="text-sm text-black">{product.name}</div>
          <div className="text-xs text-gray-400">{product.coverageSummary}</div>
        </div>
      </div>
    </Link>
  );
}
