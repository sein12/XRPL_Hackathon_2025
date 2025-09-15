// src/seed.ts
import { prisma } from "./repositories/prisma";
import { Prisma, ProductCategory } from "@prisma/client";

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function main() {
  // Reset products for a clean seed
  await prisma.product.deleteMany();

  // Feature presets (all new)
  const flightFeatures: Prisma.JsonArray = [
    {
      title: "Real-time Tracking",
      body: "Monitors official flight feeds for delay/cancel events",
    },
    {
      title: "Instant Settlement",
      body: "Triggers automatic payout after event verification",
    },
  ];

  const baggageFeatures: Prisma.JsonArray = [
    {
      title: "Lost/Delayed Baggage",
      body: "Fixed indemnity for delay over threshold or loss",
    },
    {
      title: "Simple Proof",
      body: "Upload PIR or airline confirmation for fast review",
    },
  ];

  const gigInjuryFeatures: Prisma.JsonArray = [
    {
      title: "Per-Diem Benefit",
      body: "Daily benefit for medically certified downtime",
    },
    {
      title: "Digital Intake",
      body: "Mobile claim with clinic memo and invoice",
    },
  ];

  const rentalEscrowFeatures: Prisma.JsonArray = [
    {
      title: "Autonomous Release",
      body: "Funds auto-released on both-party approval",
    },
    {
      title: "Dispute Window",
      body: "Built-in review period before fallback release",
    },
  ];

  const ticketRefundFeatures: Prisma.JsonArray = [
    {
      title: "Event Cancellation",
      body: "Fixed payout on organizer cancellation",
    },
    {
      title: "Seat-Level Matching",
      body: "Match e-ticket ID to validate purchase",
    },
  ];

  const warrantyFeatures: Prisma.JsonArray = [
    {
      title: "Extended Warranty",
      body: "Covers post-manufacturer period for key failures",
    },
    { title: "Repair First", body: "Reimburse authorized repair invoices" },
  ];

  const telemedFeatures: Prisma.JsonArray = [
    {
      title: "Tele-Visit Stipend",
      body: "Stipend for approved remote consultations",
    },
    { title: "Fast Reimbursement", body: "Photo receipt + provider name only" },
  ];

  const commuteFeatures: Prisma.JsonArray = [
    {
      title: "Delay Pass",
      body: "Pay when public transit delay exceeds threshold",
    },
    {
      title: "Auto Verification",
      body: "Cross-checks official transit delay feeds",
    },
  ];

  const petSurgeryFeatures: Prisma.JsonArray = [
    {
      title: "Surgical Benefit",
      body: "Fixed benefit for listed veterinary surgeries",
    },
    {
      title: "Exclusions Clear",
      body: "Preventive and cosmetic procedures excluded",
    },
  ];

  const deviceLossFeatures: Prisma.JsonArray = [
    {
      title: "Theft/Loss Assist",
      body: "Partial indemnity after police report",
    },
    { title: "IMEI Match", body: "Validate device by IMEI/serial number" },
  ];

  await prisma.product.createMany({
    data: [
      {
        name: "Flight Cancellation Protector",
        category: ProductCategory.TRAVEL,
        premiumDrops: BigInt(6_000_000), // 6 XRP
        coverageSummary: "Fixed payout when your flight is officially canceled",
        shortDescription:
          "Automatic compensation upon airline-confirmed cancellation.",
        descriptionMd: `## Coverage
- Official airline cancellation after ticket issuance
- One payout per itinerary; see terms for exclusions

## Claim Process
1. Upload e-ticket and cancellation notice
2. System verifies airline status and pays out automatically`,
        features: flightFeatures,
        active: true,
        createdAt: daysAgo(1),
      },
      {
        name: "Checked Baggage Delay & Loss",
        category: ProductCategory.TRAVEL,
        premiumDrops: BigInt(3_800_000), // 3.8 XRP
        coverageSummary: "Compensation for baggage delays or loss",
        shortDescription:
          "Get paid for delayed or lost checked baggage with simple proof.",
        descriptionMd: `## Coverage
- Delay ≥ 6 hours: fixed payout
- Declared loss with PIR: higher fixed payout

## Claim Process
1. Submit PIR or airline confirmation
2. Instant decision if thresholds are met`,
        features: baggageFeatures,
        active: true,
        createdAt: daysAgo(2),
      },
      {
        name: "Gig Worker Injury Daily Benefit",
        category: ProductCategory.GIG,
        premiumDrops: BigInt(2_900_000), // 2.9 XRP
        coverageSummary: "Per-diem benefit for certified downtime",
        shortDescription:
          "Simple daily benefit while you recover from a covered injury.",
        descriptionMd: `## Coverage
- Per-diem payout up to 10 days per incident
- Requires clinic memo indicating rest period

## Claim Process
1. Upload clinic memo and invoice
2. Daily benefit paid automatically for approved days`,
        features: gigInjuryFeatures,
        active: true,
        createdAt: daysAgo(3),
      },
      {
        name: "Rental Deposit Smart Escrow",
        category: ProductCategory.ESCROW,
        premiumDrops: BigInt(4_500_000), // 4.5 XRP
        coverageSummary: "Autonomous escrow for short-term rentals",
        shortDescription:
          "Funds release on joint approval or after dispute window.",
        descriptionMd: `## Coverage
- Holds deposit until both parties approve release
- Auto-release after dispute window if no action

## Claim Process
1. Upload check-in/out photos if dispute arises
2. System executes release rules automatically`,
        features: rentalEscrowFeatures,
        active: true,
        createdAt: daysAgo(4),
      },
      {
        name: "Event Ticket Cancellation Payout",
        category: ProductCategory.EVENT,
        premiumDrops: BigInt(2_200_000), // 2.2 XRP
        coverageSummary: "Fixed payout for organizer-canceled events",
        shortDescription: "Seat-level validation and quick compensation.",
        descriptionMd: `## Coverage
- Organizer-announced cancellation or no-entry due to venue shutdown
- One payout per ticket ID

## Claim Process
1. Upload e-ticket and cancellation notice
2. Automatic matching and payout`,
        features: ticketRefundFeatures,
        active: true,
        createdAt: daysAgo(5),
      },
      {
        name: "Home Appliance Extended Warranty",
        category: ProductCategory.WARRANTY,
        premiumDrops: BigInt(3_300_000), // 3.3 XRP
        coverageSummary: "Post-warranty repair reimbursement",
        shortDescription:
          "Covers key failures after manufacturer warranty ends.",
        descriptionMd: `## Coverage
- Major component failure (see list in terms)
- Reimbursement up to plan limit

## Claim Process
1. Repair at authorized service center
2. Upload invoice for reimbursement`,
        features: warrantyFeatures,
        active: true,
        createdAt: daysAgo(6),
      },
      {
        name: "Telemedicine Visit Stipend",
        category: ProductCategory.TELEMED,
        premiumDrops: BigInt(1_800_000), // 1.8 XRP
        coverageSummary: "Stipend for approved tele-consultations",
        shortDescription: "Fast reimbursement for remote medical visits.",
        descriptionMd: `## Coverage
- One stipend per eligible tele-visit
- Prescription fees excluded unless specified

## Claim Process
1. Upload visit receipt and provider info
2. Quick review then payout`,
        features: telemedFeatures,
        active: true,
        createdAt: daysAgo(7),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Commuter Transit Delay Pass",
        category: ProductCategory.TRANSIT,
        premiumDrops: BigInt(1_500_000), // 1.5 XRP
        coverageSummary: "Pays when your commute is significantly delayed",
        shortDescription:
          "Automatic payout using official transit delay feeds.",
        descriptionMd: `## Coverage
- Delay ≥ 30 minutes on covered lines
- One claim per calendar day

## Claim Process
1. Register your usual route
2. System verifies delays and pays automatically`,
        features: commuteFeatures,
        active: true,
        createdAt: daysAgo(8),
      },
      {
        name: "Pet Surgical Benefit Plan",
        category: ProductCategory.PET,
        premiumDrops: BigInt(4_200_000), // 4.2 XRP
        coverageSummary: "Fixed benefit for listed pet surgeries",
        shortDescription: "Simple, surgery-based payout for dogs and cats.",
        descriptionMd: `## Coverage
- Fixed benefit for listed procedures (see schedule)
- Pre-authorization recommended for clarity

## Claim Process
1. Upload vet surgery invoice and chart
2. Fixed benefit paid on verification`,
        features: petSurgeryFeatures,
        active: true,
        createdAt: daysAgo(9),
      },
      // Inactive sample
      {
        name: "Device Theft & Loss Assist (Inactive)",
        category: ProductCategory.DEVICE,
        premiumDrops: BigInt(2_600_000), // 2.6 XRP
        coverageSummary: "Partial indemnity after verified device theft/loss",
        shortDescription:
          "Inactive sample to test filters; not shown in active lists.",
        descriptionMd: `## Coverage
- Theft or loss with police report and IMEI match
- Deductible applies per incident`,
        features: deviceLossFeatures,
        active: false,
        createdAt: daysAgo(10),
      },
    ],
  });

  console.log("✅ Seeded NEW sample products with categories.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
