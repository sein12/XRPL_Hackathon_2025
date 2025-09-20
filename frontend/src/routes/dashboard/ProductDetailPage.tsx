import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import type { Product } from "@/types/product";
import type { Policy } from "@/types/contract";
import { fetchProducts } from "@/api/product";
import { createPolicy } from "@/api/contract"; // ✅ 없으면 만들어서 사용(아래 주석 참고)
import { createEscrow } from "@/api/xrpl"; // ✅ 없으면 만들어서 사용(아래 주석 참고)
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function formatXrpFromDrops(d: string | number | undefined) {
  if (d == null) return "-";
  const drops = typeof d === "number" ? d : Number(d);
  return (drops / 1_000_000).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchProducts(); // 단건 API 없으면 리스트에서 찾기
        if (!mounted) return;
        setProducts(res ?? []);
      } catch (e: any) {
        setErr(e?.response?.data?.error ?? "상품을 불러오지 못했습니다.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const product = useMemo(
    () => products?.find((p) => String(p.id) === String(id)) ?? null,
    [products, id]
  );

  const onConfirmJoin = useCallback(async () => {
    if (!product) return;
    try {
      setSubmitting(true);
      const _policy: Policy = await createPolicy(product.id);
      const escrow = await createEscrow(
        formatXrpFromDrops(product.premiumDrops)
      );
      // 가입 완료 후 계약 목록으로 이동
      nav("/dashboard/contracts", { replace: true });
    } catch (e: any) {
      alert(e?.response?.data?.error ?? "가입에 실패했습니다.");
    } finally {
      setSubmitting(false);
      setConfirmOpen(false);
    }
  }, [product, nav]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-28 rounded bg-muted animate-pulse" />
        <div className="h-[120px] rounded-lg bg-muted animate-pulse" />
        <div className="h-[160px] rounded-lg bg-muted animate-pulse" />
        <div className="h-[120px] rounded-lg bg-muted animate-pulse" />
      </div>
    );
  }

  if (err) return <EmptyState title="오류" desc={err} />;
  if (!product) return <EmptyState title="상품을 찾을 수 없어요" />;

  return (
    <div className="px-5 pt-16 space-y-6">
      <div className="space-y-1">
        <Badge>{product.category}</Badge>
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p className="text-xs text-gray-400">{product.coverageSummary}</p>
      </div>

      <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-4 ">
        <span className="text-sm text-black">{product.shortDescription}</span>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold">Premium Drops</span>
            <span className=" text-sm">
              {formatXrpFromDrops(product.premiumDrops)} XRP
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold">Payout Drops</span>
            <span className=" text-sm">
              {formatXrpFromDrops(product.payoutDrops)} XRP
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold">Description</span>
            {product.features.map((item, index) => (
              <span key={index} className="text-sm">
                {index + 1}. {item.body}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2">
        <Button
          className="w-full h-12"
          onClick={() => setConfirmOpen(true)}
          disabled={submitting}
        >
          {submitting ? "처리 중..." : "보험 가입하기"}
        </Button>
      </div>

      {/* 확인 다이얼로그 (공용 컴포넌트 사용) */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="보험 가입 확인"
        description={`"${product.name}"\n상품을 가입하시겠어요?`}
        onConfirm={onConfirmJoin}
        disabled={submitting}
      />
    </div>
  );
}
