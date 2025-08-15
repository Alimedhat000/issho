-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "password" TEXT,
ADD COLUMN     "tokenVersion" INTEGER NOT NULL DEFAULT 0;
