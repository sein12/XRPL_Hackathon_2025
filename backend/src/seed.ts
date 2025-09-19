// scripts/seed_products.ts (예시)
// 프로젝트 구조에 맞게 경로만 조정하세요.
import { prisma } from "./repositories/prisma";
import { Prisma, ProductCategory } from "@prisma/client";

type Feature = { title: string; body: string };

function buildMd(
  name: string,
  shortDescription: string,
  coverageSummary: string,
  features: Feature[]
) {
  return [
    `# ${name}`,
    "",
    shortDescription,
    "",
    "## Coverage Summary",
    coverageSummary,
    "",
    "## Features",
    ...features.map((f) => `- **${f.title}** — ${f.body}`),
  ].join("\n");
}

async function main() {
  // 필요 시 초기화
  // await prisma.product.deleteMany();

  const products: Array<{
    name: string;
    premiumDrops: bigint;
    coverageSummary: string;
    shortDescription: string;
    features: Feature[];
    category: ProductCategory;
    validityDays: number;
  }> = [
    {
      name: "Flight Delay Cover",
      premiumDrops: 8_000_000n, // 8 XRP
      coverageSummary:
        "Automatic payout for airline delay or cancellation events.",
      shortDescription:
        "Parametric travel insurance that monitors official flight feeds and pays instantly when delays are detected.",
      features: [
        {
          title: "Real-time Tracking",
          body: "Monitors official flight data sources for delay and cancel events.",
        },
        {
          title: "Instant Settlement",
          body: "Auto-payouts after on-chain verification—no receipts required.",
        },
        {
          title: "Global Routes",
          body: "Covers major international and domestic flights.",
        },
        {
          title: "Simple Claims",
          body: "One file upload and AI OCR verification.",
        },
      ],
      category: ProductCategory.TRAVEL,
      validityDays: 14,
    },
    {
      name: "Baggage Delay & Loss",
      premiumDrops: 6_000_000n, // 6 XRP
      coverageSummary:
        "Fixed indemnity if baggage is delayed beyond threshold or officially lost.",
      shortDescription:
        "Get a fixed payout for baggage delays or loss—just upload the PIR or airline confirmation.",
      features: [
        {
          title: "Delay Threshold",
          body: "Payout eligible after 6+ hours delay.",
        },
        {
          title: "Fixed Indemnity",
          body: "Clear, upfront amount—no itemized receipts.",
        },
        {
          title: "PIR Support",
          body: "Accepts standard Property Irregularity Report documents.",
        },
        {
          title: "24/7 Handling",
          body: "Submit anytime, reviewed by AI first.",
        },
      ],
      category: ProductCategory.TRAVEL,
      validityDays: 14,
    },
    {
      name: "Smartphone Damage Shield",
      premiumDrops: 20_000_000n, // 20 XRP
      coverageSummary: "Accidental damage protection for your smartphone.",
      shortDescription:
        "Covers accidental screen cracks and damage with low-friction AI evidence checks.",
      features: [
        {
          title: "Screen Coverage",
          body: "Cracked display and accidental drops covered.",
        },
        {
          title: "AI OCR",
          body: "Photo/receipt OCR to speed up verification.",
        },
        {
          title: "One Claim/Year",
          body: "One approved claim per subscription year.",
        },
        {
          title: "Fast Payout",
          body: "Funds released after approval confirmation.",
        },
      ],
      category: ProductCategory.DEVICE,
      validityDays: 365,
    },
    {
      name: "Pet Vet Micro-Cover",
      premiumDrops: 10_000_000n, // 10 XRP
      coverageSummary: "Fixed subsidy for eligible veterinary visits.",
      shortDescription:
        "A lightweight plan that subsidizes common vet visits for pets with simple proof.",
      features: [
        {
          title: "Invoice OCR",
          body: "Upload clinic invoice; AI extracts key fields.",
        },
        {
          title: "Eligible Visits",
          body: "Routine care and common acute visits.",
        },
        {
          title: "Rapid Review",
          body: "Automated checks with manual fallback.",
        },
        {
          title: "Transparent Limits",
          body: "Clear per-visit cap and frequency.",
        },
      ],
      category: ProductCategory.PET,
      validityDays: 90,
    },
    {
      name: "Gig No-Show Protection",
      premiumDrops: 12_000_000n, // 12 XRP
      coverageSummary: "Pays if your client cancels within 24h of job start.",
      shortDescription:
        "Protects freelancers from last-minute cancellations with evidence from calendar and chats.",
      features: [
        {
          title: "Calendar Proof",
          body: "Accepts signed scope and scheduled time proof.",
        },
        {
          title: "Grace Window",
          body: "Defined cancellation window and payout tiers.",
        },
        {
          title: "AI Evidence",
          body: "OCR + text analysis for quick adjudication.",
        },
        { title: "Fair Disputes", body: "Manual review path for edge cases." },
      ],
      category: ProductCategory.GIG,
      validityDays: 60,
    },
    {
      name: "XRPL Escrowed Purchase",
      premiumDrops: 5_000_000n, // 5 XRP
      coverageSummary:
        "Funds held in XRPL escrow and released on delivery confirmation.",
      shortDescription:
        "Trust-minimized purchase protection using XRPL Escrow with dual-signature release.",
      features: [
        {
          title: "XRPL Escrow",
          body: "Locks funds until delivery proof is confirmed.",
        },
        {
          title: "Dual-Signature",
          body: "Both sides (or oracle) can authorize release.",
        },
        {
          title: "Dispute Window",
          body: "Auto-refund if conditions are unmet by expiry.",
        },
        { title: "Auditable", body: "On-chain references for transparency." },
      ],
      category: ProductCategory.ESCROW,
      validityDays: 30,
    },
  ];

  for (const p of products) {
    const descriptionMd = buildMd(
      p.name,
      p.shortDescription,
      p.coverageSummary,
      p.features
    );
    await prisma.product.create({
      data: {
        name: p.name,
        premiumDrops: p.premiumDrops,
        coverageSummary: p.coverageSummary,
        shortDescription: p.shortDescription,
        descriptionMd,
        features: p.features as unknown as Prisma.JsonArray,
        category: p.category,
        validityDays: p.validityDays,
        active: true,
      },
    });
  }

  console.log(`✅ Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
