import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/product";
import { Link } from "react-router-dom";

function formatXrpFromDrops(d: string | number) {
  const drops = typeof d === "number" ? d : Number(d);
  return (
    (drops / 1_000_000).toLocaleString(undefined, {
      maximumFractionDigits: 6,
    }) + " XRP"
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/dashboard/products/${product.id}`}>
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{product.name}</CardTitle>
          {product.coverageSummary && (
            <p className="text-xs text-muted-foreground">
              {product.coverageSummary}
            </p>
          )}
        </CardHeader>
        <CardContent className="pt-0 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">월 보험료(예)</span>
            <span className="font-medium">
              {formatXrpFromDrops(product.premiumDrops)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
