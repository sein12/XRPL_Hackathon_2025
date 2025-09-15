// src/seed.ts
import { prisma } from "./repositories/prisma";
import { Prisma } from "@prisma/client";

async function main() {
  // 개발 중엔 매번 초기화가 편리
  await prisma.product.deleteMany();

  const travelFeatures: Prisma.JsonArray = [
    { title: "자동 지급", body: "항공편 지연 조건 충족 시 즉시 지급" },
    { title: "간편 청구", body: "탑승권/영수증 업로드만으로 청구 완료" },
  ];

  const freelanceFeatures: Prisma.JsonArray = [
    { title: "마일스톤 연동", body: "검수 승인 시 자동 송금" },
    { title: "투명 이력", body: "XRPL 트랜잭션으로 지급 이력 보관" },
  ];

  await prisma.product.createMany({
    data: [
      {
        name: "여행 지연 보험",
        premiumDrops: BigInt(5_000_000), // 5 XRP
        coverageSummary: "항공편 2시간 이상 지연 시 50 XRP 지급",
        shortDescription: "여행 중 항공편 지연을 자동 보상해주는 소액 보험",
        descriptionMd: `## 보장 범위
- 항공편 출발 지연 2시간 이상: 50 XRP 지급
- 일부 노선은 베타 적용 중

## 청구 방법
1. 탑승권 또는 영수증 이미지를 업로드
2. AI 판독 후 조건 충족 시 자동 승인 및 지급`,
        features: travelFeatures,
      },
      {
        name: "프리랜서 마일스톤 보험",
        premiumDrops: BigInt(3_000_000), // 3 XRP
        coverageSummary: "검수 승인 시 계약 금액을 자동 지급",
        shortDescription:
          "프리랜서·아웃소싱 작업의 마일스톤 완료를 안전하게 보장",
        descriptionMd: `## 보장 범위
- 합의된 작업 결과물이 승인되면 계약 금액을 자동 지급
- 장기·반복 계약에 적합

## 청구 방법
1. 작업 결과물 및 관련 영수증 업로드
2. 검수 승인 후 자동 송금`,
        features: freelanceFeatures,
      },
    ],
  });

  console.log("✅ Seeded sample products.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
