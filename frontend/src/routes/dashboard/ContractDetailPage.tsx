import { useEffect, useState, useMemo } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { fetchPolicyById } from "@/api/contract";
import type { Policy } from "@/types/contract";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

function formatXrpFromDrops(d: string | number | undefined) {
  const drops = typeof d === "number" ? d : Number(d);
  return (
    (drops / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    }) + " XRP"
  );
}

const statusColor: Record<
  Policy["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  EXPIRED: "destructive",
  CANCELLED: "outline",
};

export default function ContractDetailPage() {
  const { id: paramId } = useParams<{ id: string }>();
  const [sp] = useSearchParams(); // 기존 쿼리방식 호환 (/contracts?id=...)
  const id = paramId || sp.get("id") || "";
  const nav = useNavigate();
  const { user } = useAuth();

  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const p = await fetchPolicyById(id);
        if (alive) setPolicy(p);
      } catch (e: any) {
        if (alive)
          setErr(e?.response?.data?.error ?? "Failed to load contract.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (!id)
    return (
      <EmptyState title="Invalid request" desc="Contract id is missing." />
    );
  if (loading) return <SkeletonDetail />;
  if (err) return <EmptyState title="Error" desc={err} />;
  if (!policy)
    return (
      <EmptyState title="Not found" desc="This contract does not exist." />
    );

  return (
    <div className="px-5 pt-16 space-y-6">
      <div className="space-y-1">
        <div className="flex gap-2">
          <Badge variant={statusColor[policy.status]}>{policy.status}</Badge>
        </div>
        <h1 className="text-xl font-semibold">{policy.product?.name}</h1>
        <p className="text-xs text-gray-400">
          {policy.product?.coverageSummary}
        </p>
      </div>
      <div className="flex flex-col gap-4 border border-gray-200 rounded-md p-4 ">
        <span className="text-sm text-black">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rem, culpa
          qui dolor vitae in eos reprehenderit assumenda deserunt illum unde
          molestias, autem quisquam, doloremque minus officiis! Autem doloremque
          ducimus itaque!
        </span>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold">Premium Drops</span>
            <span className=" text-sm">
              {formatXrpFromDrops(policy.product?.premiumDrops)}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold">description</span>
            <span className="text-sm">
              {formatXrpFromDrops(policy.product?.premiumDrops)}
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
      </div>

      <Button
        className="w-full h-12"
        onClick={() => {
          nav(`/dashboard/claims/new/${policy.id}`);
        }}
      >
        Claim
      </Button>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className="space-y-4">
      <div className="h-[121px] w-full rounded-lg bg-muted animate-pulse" />
      <div className="h-[80px] w-full rounded-lg bg-muted animate-pulse" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-10 rounded-md bg-muted animate-pulse" />
        <div className="h-10 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}
