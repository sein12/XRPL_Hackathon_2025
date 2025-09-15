import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProducts } from "@/api/product";
import { fetchMyPolicies } from "@/api/contract";
import type { Product } from "@/types/product";
import type { Policy } from "@/types/contract";
import ProductCard from "@/components/product/ProductCard";
import ContractCard from "@/components/contract/ContractCard";
import { FilePlus2, ShoppingBag } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";

export default function HomePage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [policies, setPolicies] = useState<Policy[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [pRes, cRes] = await Promise.all([
          fetchProducts(),
          fetchMyPolicies(),
        ]);
        if (!mounted) return;
        setProducts(pRes ?? []);
        setPolicies(cRes ?? []);
      } catch (e: any) {
        setErr(e?.response?.data?.error ?? "데이터를 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const latestPolicy = useMemo(() => {
    if (!policies || policies.length === 0) return null;
    return [...policies].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [policies]);

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        type="button"
        className="w-full text-xs text-muted-foreground"
        onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("authUser");
          // 필요하면 새로고침
          // window.location.reload();
        }}
      >
        개발용: 인증 초기화(토큰 삭제)
      </Button>

      {/* 최신 계약 / 바로가기 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">내 최신 계약</h2>
        {loading ? (
          <SkeletonBox />
        ) : err ? (
          <EmptyState title="오류" desc={err} />
        ) : latestPolicy ? (
          <ContractCard policy={latestPolicy} />
        ) : (
          <EmptyState
            title="계약이 없습니다"
            desc="상품을 가입하고 혜택을 받아보세요."
          />
        )}

        {/* 빠른 실행 */}
        <div className="grid grid-cols-2 gap-3">
          <Button asChild variant="outline" className="h-12">
            <Link to="/dashboard/claims">
              <FilePlus2 className="mr-2 h-4 w-4" />
              보험 청구하기
            </Link>
          </Button>
          <Button asChild className="h-12">
            <Link to="/dashboard/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              상품 둘러보기
            </Link>
          </Button>
        </div>
      </section>
      {/* 추천 상품 */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">추천 상품</h2>
        {loading ? (
          <div className="grid gap-3">
            <SkeletonBox />
            <SkeletonBox />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-3">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              표시할 상품이 없습니다.
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}

function SkeletonBox() {
  return <div className="h-[92px] w-full rounded-md bg-muted animate-pulse" />;
}
