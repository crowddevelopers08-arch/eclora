-- CreateTable
CREATE TABLE "HairScanLead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "concern" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "lifestyle" TEXT NOT NULL,
    "pageUrl" TEXT,
    "sheetSynced" BOOLEAN NOT NULL DEFAULT false,
    "crmSynced" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HairScanLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HairScanPhoto" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leadId" TEXT NOT NULL,
    "view" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'image/jpeg',
    "data" BYTEA NOT NULL,
    "driveUrl" TEXT,

    CONSTRAINT "HairScanPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HairScanLead_createdAt_idx" ON "HairScanLead"("createdAt");

-- CreateIndex
CREATE INDEX "HairScanLead_phone_idx" ON "HairScanLead"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "HairScanPhoto_leadId_view_key" ON "HairScanPhoto"("leadId", "view");

-- AddForeignKey
ALTER TABLE "HairScanPhoto" ADD CONSTRAINT "HairScanPhoto_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "HairScanLead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

