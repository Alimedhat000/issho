/*
  Warnings:

  - Added the required column `color` to the `folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."folder" ADD COLUMN     "color" TEXT NOT NULL;
