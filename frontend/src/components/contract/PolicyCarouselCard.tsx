import { Link } from "react-router-dom";
import type { Policy } from "@/types/contract";
import { dropsToXrp } from "@/lib/utils";

export default function PolicyCarouselCard({
  policy,
  link,
}: {
  policy: Policy;
  link: string;
}) {
  const expiredDate = new Date(policy.expireAt).toISOString().slice(0, 10);

  return (
    <Link to={link} className="snap-center shrink-0 w-[335px]">
      <div className="border border-gray-300 shadow-md rounded-md bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-[16px] font-semibold tracking-[-0.25px]">
            {policy.product?.name}
          </div>
          <span className="rounded bg-[#92DF95] text-white text-[10px] leading-[19px] px-2 py-[2px]">
            {policy.status}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-[55px_1fr] gap-x-5 gap-y-2 text-[12px] leading-[1.2]">
          <div className="text-[#C6C6C6]">피보험자</div>
          <div className="text-black">{policy.user?.name}</div>

          <div className="text-[#C6C6C6]">보험료</div>
          <div className="text-black">
            {dropsToXrp(policy.product?.premiumDrops || 0)} XRP
          </div>

          <div className="text-[#C6C6C6]">만료일</div>
          <div className="text-black">{expiredDate}</div>
        </div>
      </div>
    </Link>
  );
}
