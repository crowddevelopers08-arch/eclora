-- AlterTable: backfill existing rows with a random token, then drop the DB default (Prisma generates uuids client-side)
ALTER TABLE "HairScanPhoto" ADD COLUMN "token" TEXT NOT NULL DEFAULT gen_random_uuid()::text;
ALTER TABLE "HairScanPhoto" ALTER COLUMN "token" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "HairScanPhoto_token_key" ON "HairScanPhoto"("token");
