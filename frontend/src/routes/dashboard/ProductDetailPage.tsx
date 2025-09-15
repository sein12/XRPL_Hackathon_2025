import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import type { Product } from "@/types/product";
import MarkdownViewer from "@/components/common/MarkdownViewer";
import type { Policy } from "@/types/contract";
import { fetchProducts } from "@/api/product";
import { createPolicy } from "@/api/contract"; // ✅ 없으면 만들어서 사용(아래 주석 참고)
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

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
    <div className="px-5 pt-16 space-y-6">
      <div className="space-y-1">
        <div className="text-xs text-gray-400">{product.category}</div>
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <p className="text-xs text-gray-400">{product.coverageSummary}</p>
      </div>

      <div className="flex flex-col gap-2 border border-gray-300 rounded-md p-4 ">
        <span className="text-sm text-black">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem, culpa
          qui dolor vitae in eos reprehenderit assumenda deserunt illum unde
          molestias, autem quisquam, doloremque minus officiis! Autem doloremque
          ducimus itaque!
        </span>

        <Separator />
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold">Premium Drops</span>
          <span className=" text-sm">
            {formatXrpFromDrops(product.premiumDrops)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold">description</span>
          <span className="text-sm">
            {formatXrpFromDrops(product.premiumDrops)}
          </span>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>응급 치과 진료 시 자동 보장 처리</li>
          <li>영수증 업로드만으로 간편 청구</li>
          <li>특약/면책 조건은 세부 약관 참고</li>
        </ul>

        <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
          <li>계약 해지/철회는 관련 법령 및 약관을 따릅니다.</li>
          <li>보장 제외 항목이 있을 수 있습니다.</li>
        </ul>
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
