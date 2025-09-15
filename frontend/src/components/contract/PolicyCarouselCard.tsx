import { Link } from "react-router-dom";
import type { Policy } from "@/types/contract";
import { dropsToXrp } from "@/lib/utils";

export default function PolicyCarouselCard({
  policy,
  insuredName,
  premiumText, // TODO: 실제 데이터 연결 시 교체
}: {
  policy: Policy;
  insuredName?: string;
  premiumText?: string;
}) {
  const name = policy.product?.name;
  const lastMonth = new Date(policy.createdAt).toISOString().slice(0, 10);

  return (
    <Link
      to={`/dashboard/contracts?id=${policy.id}`}
      className="snap-center shrink-0 w-[335px]"
    >
      <div className="border border-gray-300 shadow-md rounded-md bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold tracking-[-0.25px]">
            {name}
          </div>
          <span className="rounded bg-[#92DF95] text-white text-[10px] leading-[19px] px-2 py-[2px]">
            {policy.status}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-[55px_1fr] gap-x-5 gap-y-2 text-[12px] leading-[1.2]">
          <div className="text-[#C6C6C6]">피보험자</div>
          <div className="text-black">{insuredName}</div>

          <div className="text-[#C6C6C6]">보험료</div>
          <div className="text-black">{dropsToXrp(premiumText || 0)} XRP</div>

          <div className="text-[#C6C6C6]">생성일</div>
          <div className="text-black">{lastMonth}</div>
        </div>
      </div>
    </Link>
  );
}
