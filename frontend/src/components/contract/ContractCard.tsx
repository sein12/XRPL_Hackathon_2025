import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Policy } from "@/types/contract";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const statusColor: Record<
  Policy["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  PAID: "secondary",
  EXPIRED: "destructive",
};

export default function ContractCard({ policy }: { policy: Policy }) {
  const name = policy.product?.name ?? "보험 상품";
  const created = new Date(policy.createdAt).toLocaleDateString();

  return (
    <Link to={`/dashboard/contracts?id=${policy.id}`}>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{name}</CardTitle>
            <Badge variant={statusColor[policy.status]}>{policy.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 text-sm text-muted-foreground">
          가입일: {created}
        </CardContent>
      </Card>
    </Link>
  );
}
