-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "premiumDrops" BIGINT NOT NULL,
    "payoutDrops" BIGINT NOT NULL DEFAULT 0,
    "coverageSummary" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "descriptionMd" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "validityDays" INTEGER NOT NULL
);
INSERT INTO "new_Product" ("active", "category", "coverageSummary", "createdAt", "descriptionMd", "features", "id", "name", "premiumDrops", "shortDescription", "validityDays") SELECT "active", "category", "coverageSummary", "createdAt", "descriptionMd", "features", "id", "name", "premiumDrops", "shortDescription", "validityDays" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_active_createdAt_idx" ON "Product"("active", "createdAt");
CREATE INDEX "Product_category_active_createdAt_idx" ON "Product"("category", "active", "createdAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
