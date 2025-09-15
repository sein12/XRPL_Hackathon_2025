// src/seed.ts
import { prisma } from "./repositories/prisma";
import { Prisma } from "@prisma/client";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  // 개발 중엔 초기화가 편리
  await prisma.product.deleteMany();

  // 공통 features 샘플
  const travelFeatures: Prisma.JsonArray = [
    { title: "자동 지급", body: "항공편 지연 조건 충족 시 즉시 지급" },
    { title: "간편 청구", body: "탑승권/영수증 업로드만으로 청구 완료" },
  ];

  const dentalFeatures: Prisma.JsonArray = [
    { title: "응급 진료 보장", body: "치통/충치 등 응급 치과 진료 시 보장" },
    { title: "간편 영수증", body: "영수증만 제출하면 자동 심사" },
  ];

  const outpatientFeatures: Prisma.JsonArray = [
    { title: "소액 진료", body: "경미한 외래 진료를 신속 보장" },
    { title: "모바일 청구", body: "사진 업로드로 간편 접수" },
  ];

  const deviceFeatures: Prisma.JsonArray = [
    { title: "파손 보장", body: "휴대폰 파손 수리비 보장" },
    { title: "1시간 승인", body: "간단 심사 후 빠른 승인" },
  ];

  const petFeatures: Prisma.JsonArray = [
    { title: "반려동물 진료", body: "진료·처방·수술 일부 비용 보장" },
    { title: "예방접종 제외", body: "예방 목적은 보장 제외" },
  ];

  const freelanceFeatures: Prisma.JsonArray = [
    { title: "마일스톤 연동", body: "검수 승인 시 자동 송금" },
    { title: "투명 이력", body: "XRPL 트랜잭션으로 지급 이력 보관" },
  ];

  await prisma.product.createMany({
    data: [
      // ── 스샷 톤에 맞춘 예시들 ────────────────────────────────────────────
      {
        name: "치과 응급 진료 보험",
        premiumDrops: BigInt(4_000_000), // 4 XRP
        coverageSummary: "응급 치과 진료 시 소액 자동 보장",
        shortDescription:
          "갑작스러운 치통/충치 등으로 응급 치과 진료가 필요할 때 영수증만 제출하면 자동 보장되는 소액 보험입니다.",
        descriptionMd: `## 보장 범위
- 응급 치과 진료(충치, 발치 등) 영수증 제출 시 정액 보장
- 동일 월 1회 한도, 세부 보장 금액은 약관 참조

## 청구 방법
1. 진료 영수증을 촬영/업로드
2. 자동 판독 후 조건 충족 시 즉시 지급`,
        features: dentalFeatures,
        active: true,
        createdAt: daysAgo(1),
      },
      {
        name: "일반 외래 소액 진료 보험",
        premiumDrops: BigInt(2_500_000), // 2.5 XRP
        coverageSummary: "경미한 외래 진료에 대해 신속 보장",
        shortDescription:
          "가벼운 외래 진료·처방에 대해 간편 접수 후 빠르게 정액 보장합니다.",
        descriptionMd: `## 보장 범위
- 감기/상처 등 경증 외래 진료 및 처방전
- 동일 질병에 대한 중복 청구 제한`,
        features: outpatientFeatures,
        active: true,
        createdAt: daysAgo(2),
      },
      {
        name: "휴대폰 파손 보장",
        premiumDrops: BigInt(3_000_000), // 3 XRP
        coverageSummary: "휴대폰 파손 수리비 일부 보장",
        shortDescription:
          "파손 수리 영수증 업로드만으로 간단하게 보장받는 디바이스 파손 상품입니다.",
        descriptionMd: `## 보장 범위
- 액정 파손 등 기기 외관 손상 수리비
- 도난/분실은 보장 제외`,
        features: deviceFeatures,
        active: true,
        createdAt: daysAgo(3),
      },
      {
        name: "반려동물 진료 보장",
        premiumDrops: BigInt(3_500_000), // 3.5 XRP
        coverageSummary: "반려견/반려묘 진료비 일부 보장",
        shortDescription:
          "반려동물의 진료·투약·수술 비용의 일부를 간편하게 보장해 줍니다.",
        descriptionMd: `## 보장 범위
- 질병/상해 치료 관련 비용 일부
- 예방접종/미용 목적 비용은 제외`,
        features: petFeatures,
        active: true,
        createdAt: daysAgo(4),
      },
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
        active: true,
        createdAt: daysAgo(5),
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
        active: true,
        createdAt: daysAgo(6),
      },
      // 비활성 상품(리스트 필터 테스트용)
      {
        name: "테스트(비활성) 상품",
        premiumDrops: BigInt(1_000_000), // 1 XRP
        coverageSummary: "노출되면 안 되는 비활성 예시",
        shortDescription: "active=false 예시 아이템",
        descriptionMd: `비활성 상품입니다.`,
        features: [],
        active: false,
        createdAt: daysAgo(7),
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
