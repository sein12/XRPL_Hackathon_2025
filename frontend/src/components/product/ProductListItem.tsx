import { Link } from "react-router-dom";
import type { Product } from "@/types/product";

export default function ProductListItem({ product }: { product: Product }) {
  function formatXrpFromDrops(d: string | number | undefined) {
    const drops = typeof d === "number" ? d : Number(d);
    return (
      (drops / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 6,
      }) + " XRP"
    );
  }
  return (
    <Link
      to={`/dashboard/products/${product.id}`}
      className="w-full rounded-md border border-gray-300 shadow-md px-4 py-3"
    >
      <div className="flex flex-col gap-1 ">
        <div className="text-xs text-gray-400">{product.category}</div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-0.5">
            <div className="text-sm text-black">{product.name}</div>
            <div className="w-60 text-xs text-gray-400 truncate">
              {product.coverageSummary}
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <div className="text-sm">
              {formatXrpFromDrops(product.premiumDrops)}
            </div>
            <div className="text-xs text-gray-400">
              {product.validityDays} days
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
