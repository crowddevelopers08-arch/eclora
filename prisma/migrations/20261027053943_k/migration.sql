-- AlterTable
ALTER TABLE "HairScanPhoto" ALTER COLUMN "token" SET DEFAULT gen_random_uuid()::text;
