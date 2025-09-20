// src/routes/dashboard/claim/ClaimListPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchClaims } from "@/api/claim";
import type { Claim, ClaimListResponse, ClaimStatus } from "@/api/claim";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { FileText, Image as ImageIcon, ExternalLink } from "lucide-react";

export default function ClaimListPage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [items, setItems] = useState<Claim[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const data = await fetchClaims();
        if (!mounted) return;
        setItems(data.items ?? []);
        setNextCursor(data.nextCursor ?? null);
      } catch (e: any) {
        setErr(e?.response?.data?.error ?? "Failed to load claims.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const onLoadMore = async () => {
    // 백엔드가 nextCursor를 아직 지원하지 않는다면 이 버튼은 숨기거나 비활성화하세요.
    // 여기서는 자리만 마련.
  };

  if (loading) return <ClaimListSkeleton />;

  if (err) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center space-y-4">
        <p className="text-sm text-red-500">{err}</p>
        <Button asChild variant="outline">
          <Link to="/dashboard">대시보드로 돌아가기</Link>
        </Button>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-3">
        <h2 className="text-xl font-semibold">접수된 청구가 없습니다</h2>
        <p className="text-sm text-muted-foreground">
          청구를 시작하려면 보험 계약 상세에서 “청구하기”를 눌러주세요.
        </p>
        <Button asChild className="mt-2">
          <Link to="/dashboard/contracts">내 계약 보기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">내 청구 내역</h1>
        <Button asChild variant="outline">
          <Link to="/dashboard/contracts">계약 목록</Link>
        </Button>
      </header>

      <div className="grid gap-4">
        {items.map((c) => (
          <ClaimCard key={c.id} claim={c} />
        ))}
      </div>

      {nextCursor && (
        <div className="pt-4 flex justify-center">
          <Button onClick={onLoadMore} variant="outline">
            더 불러오기
          </Button>
        </div>
      )}
    </div>
  );
}

/** ================= Sub Components ================= */

function ClaimCard({ claim }: { claim: Claim }) {
  const created = safeFormat(claim.createdAt);
  const updated = safeFormat(claim.updatedAt);

  const isImage =
    typeof claim.evidenceUrl === "string" &&
    (claim.evidenceUrl.endsWith(".png") ||
      claim.evidenceUrl.endsWith(".jpg") ||
      claim.evidenceUrl.endsWith(".jpeg") ||
      claim.evidenceUrl.startsWith("data:image/"));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <BadgeStatus status={claim.status} />
          <span className="text-sm text-muted-foreground">
            #{claim.id.slice(0, 8)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">생성: {created}</span>
      </CardHeader>

      <CardContent className="grid gap-3">
        <div className="flex items-center gap-3">
          {isImage ? (
            <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex items-center justify-center">
              {/* 썸네일 (안전하게 object-fit) */}
              <img
                src={claim.evidenceUrl}
                alt="evidence"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              청구ID: {claim.id}
            </div>
            <div className="text-xs text-muted-foreground">
              최근 업데이트: {updated}
            </div>
          </div>

          {claim.evidenceUrl && (
            <Button asChild size="sm" variant="ghost" className="shrink-0">
              <a href={claim.evidenceUrl} target="_blank" rel="noreferrer">
                증빙 보기 <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <Button asChild variant="secondary">
          <Link to={`/dashboard/claims/${claim.id}`}>상세 보기</Link>
        </Button>
        <Button asChild>
          <Link to={`/dashboard/claims/${claim.id}/complete`}>완료 화면</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function BadgeStatus({ status }: { status: ClaimStatus }) {
  const variant =
    status === "APPROVED"
      ? "default"
      : status === "REJECTED"
      ? "destructive"
      : status === "PAID"
      ? "secondary"
      : status === "MANUAL"
      ? "outline"
      : "outline"; // SUBMITTED 등 기본

  return <Badge variant={variant as any}>{status}</Badge>;
}

function safeFormat(iso: string | null | undefined) {
  if (!iso) return "-";
  try {
    return format(parseISO(iso), "yyyy-MM-dd HH:mm");
  } catch {
    return iso;
  }
}

function ClaimListSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-16 h-16 rounded-md" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-9 w-28" />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
