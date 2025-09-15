import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchProducts } from "@/api/product";
import { fetchMyPolicies } from "@/api/contract";
import type { Product } from "@/types/product";
import type { Policy } from "@/types/contract";
import QuickTile from "@/components/common/QuickTile";
import PolicyCarousel from "@/components/contract/PolicyCarousel";
import ProductTeaser from "@/components/product/ProductTeaser";
import { FilePlus2, Search, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const nav = useNavigate();
  const { user } = useAuth();

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

  const policyCount = policies?.length ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 p-4">
        {/* 상단 인사 */}
        <section className="space-y-1">
          <h2 className="text-xl font-semibold">{user?.name ?? "사용자"}님</h2>
          <p className="text-base">
            <span className="font-semibold text-sky-600 underline-offset-4">
              {policyCount}건
            </span>
            의 계약이 있습니다.
          </p>
        </section>

        {/* 계약 캐러셀 */}
        <section>
          <PolicyCarousel
            policies={policies ?? []}
            loading={loading}
            error={err}
            insuredName={user?.username}
          />
        </section>
      </div>

      {/* 자주 쓰는 메뉴 */}
      <section className="space-y-3">
        <h3 className="text-[18px]">자주 쓰는 메뉴</h3>
        <div className="grid grid-cols-3 gap-3">
          <QuickTile
            label="보험료 납입"
            icon={<DollarSign className="w-5 h-5" />}
            onClick={() => nav("/dashboard/contracts")}
          />
          <QuickTile
            label="보험금 청구"
            icon={<FilePlus2 className="w-5 h-5" />}
            onClick={() => nav("/dashboard/claims")}
          />
          <QuickTile
            label="계약 조회"
            icon={<Search className="w-5 h-5" />}
            onClick={() => nav("/dashboard/contracts")}
          />
        </div>
      </section>

      {/* 추천 상품 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px]">상품</h3>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-0 text-gray-500"
          >
            <Link to="/dashboard/products">전체 보기</Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-3">
            <SkeletonBox />
            <SkeletonBox />
            <SkeletonBox />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid gap-3">
            {products.slice(0, 3).map((p) => (
              <ProductTeaser key={p.id} product={p} />
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

      {/* 개발 편의: 토큰 초기화 */}
      <Button
        variant="ghost"
        type="button"
        className="w-full text-xs text-muted-foreground"
        onClick={() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("authUser");
        }}
      >
        개발용: 인증 초기화(토큰 삭제)
      </Button>
    </div>
  );
}

function SkeletonBox() {
  return <div className="h-[66px] w-full rounded-lg bg-muted animate-pulse" />;
}
