/*
  Warnings:

  - Added the required column `payoutDropsSnapshot` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productDescriptionMd` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Claim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "policyId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
    "rejectedReason" TEXT,
    "incidentDate" DATETIME NOT NULL,
    "details" TEXT NOT NULL,
    "productDescriptionMd" TEXT NOT NULL,
    "payoutDropsSnapshot" BIGINT NOT NULL,
    "evidenceUrl" TEXT NOT NULL,
    "aiDecision" TEXT,
    "aiRaw" JSONB,
    "payoutAt" DATETIME,
    "payoutTxHash" TEXT,
    "payoutMeta" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Claim_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Claim" ("aiDecision", "aiRaw", "createdAt", "details", "evidenceUrl", "id", "incidentDate", "payoutAt", "payoutMeta", "payoutTxHash", "policyId", "rejectedReason", "status", "updatedAt") SELECT "aiDecision", "aiRaw", "createdAt", "details", "evidenceUrl", "id", "incidentDate", "payoutAt", "payoutMeta", "payoutTxHash", "policyId", "rejectedReason", "status", "updatedAt" FROM "Claim";
DROP TABLE "Claim";
ALTER TABLE "new_Claim" RENAME TO "Claim";
CREATE INDEX "Claim_policyId_status_createdAt_idx" ON "Claim"("policyId", "status", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
