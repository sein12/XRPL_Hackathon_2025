import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import ProductSection from "@/components/product/ProductSection";
import type { Product } from "@/types/product";
import type { Policy } from "@/types/contract";
import { fetchProducts } from "@/api/product";
import { createPolicy } from "@/api/contract"; // ✅ 없으면 만들어서 사용(아래 주석 참고)
import ConfirmDialog from "@/components/common/ConfirmDialog";

function formatXrpFromDrops(d: string | number | undefined) {
  if (d == null) return "-";
  const drops = typeof d === "number" ? d : Number(d);
  return (
    (drops / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    }) + " XRP"
  );
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
      // 서버에 정책(계약) 생성
      // createPolicy(productId) 시그니처는 프로젝트에 맞게 구현
      const _policy: Policy = await createPolicy(product.id);
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
    <div className="space-y-5">
      {/* 상단 메타/히어로 */}
      <div className="space-y-1">
        <div className="text-xs text-[#999] tracking-[-0.25px]">
          일반 / 의료
        </div>
        <h1 className="text-[20px] font-semibold tracking-[-0.25px] leading-6">
          {product.name}
        </h1>
        <p className="text-[12px] text-[#999] leading-[18px]">
          {product.coverageSummary ?? "상품 개요 설명이 여기에 들어갑니다."}
        </p>
      </div>

      {/* 예상 보험료 */}
      <ProductSection title="예상 보험료">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">월 보험료(예)</span>
          <span className="text-base font-medium">
            {formatXrpFromDrops(product.premiumDrops)}
          </span>
        </div>
      </ProductSection>

      {/* 보장 내용 / 유의 사항 */}
      <ProductSection title="보장 내용">
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>응급 치과 진료 시 자동 보장 처리</li>
          <li>영수증 업로드만으로 간편 청구</li>
          <li>특약/면책 조건은 세부 약관 참고</li>
        </ul>
      </ProductSection>

      <ProductSection title="유의 사항">
        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>계약 해지/철회는 관련 법령 및 약관을 따릅니다.</li>
          <li>보장 제외 항목이 있을 수 있습니다.</li>
        </ul>
      </ProductSection>

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
        description={`"${product.name}" 상품을 가입하시겠어요?`}
        confirmText={submitting ? "처리 중..." : "확인"}
        cancelText="취소"
        onConfirm={onConfirmJoin}
        disabled={submitting}
      />
    </div>
  );
}
