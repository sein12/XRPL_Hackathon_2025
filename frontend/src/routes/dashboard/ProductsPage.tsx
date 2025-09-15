import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "@/api/product";
import type { Product } from "@/types/product";
import EmptyState from "@/components/common/EmptyState";
import ProductListItem from "@/components/product/ProductListItem";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchProducts();
        if (!mounted) return;
        setProducts(res ?? []);
      } catch (e: any) {
        setErr(e?.response?.data?.error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const items = useMemo(() => products ?? [], [products]);

  return (
    <div className="px-5 pt-16 space-y-6">
      <h1 className="text-2xl font-semibold">Insurance Products</h1>

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
          <SkeletonItem />
        </div>
      ) : err ? (
        <EmptyState title="Error" desc={err} />
      ) : items.length === 0 ? (
        <EmptyState title="표시할 상품이 없습니다." />
      ) : (
        <div className="flex flex-col items-center gap-2.5 w-full">
          {items.map((p) => (
            <ProductListItem key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonItem() {
  // 335 × 105 카드 스켈레톤
  return (
    <div className="w-[335px] h-[105px] rounded-lg bg-muted animate-pulse" />
  );
}
