import { Link } from "react-router-dom";
import type { Policy } from "@/types/contract";

export default function PolicyCarouselCard({
  policy,
  insuredName,
  premiumText = "29 XRP", // TODO: 실제 데이터 연결 시 교체
  statusLabel = "정상",
}: {
  policy: Policy;
  insuredName?: string;
  premiumText?: string;
  statusLabel?: string;
}) {
  const name = policy.product?.name ?? "보험 상품";
  const lastMonth = new Date(policy.createdAt)
    .toISOString()
    .slice(0, 7)
    .replace("-", ".");

  return (
    <Link
      to={`/dashboard/contracts?id=${policy.id}`}
      className="snap-center shrink-0 w-[335px]"
    >
      <div className="border border-[rgba(198,198,198,0.98)] shadow-[0_0_4px_rgba(0,0,0,0.25)] rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold tracking-[-0.25px]">
            {name}
          </div>
          <span className="rounded bg-[#92DF95] text-white text-[10px] leading-[19px] px-2 py-[2px]">
            {statusLabel}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-[55px_1fr] gap-x-5 gap-y-2 text-[12px] leading-[1.2]">
          <div className="text-[#C6C6C6]">피보험자</div>
          <div className="text-black">{insuredName ?? "—"}</div>

          <div className="text-[#C6C6C6]">보험료</div>
          <div className="text-black">{premiumText}</div>

          <div className="text-[#C6C6C6]">납입최종월</div>
          <div className="text-black">{lastMonth}</div>
        </div>
      </div>
    </Link>
  );
}
