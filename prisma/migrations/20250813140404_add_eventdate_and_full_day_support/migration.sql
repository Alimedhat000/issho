/*
  Warnings:

  - You are about to drop the column `description` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `day` on the `time_slots` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[event_date_id,hour,minute,fullDay,participant_id]` on the table `time_slots` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_date_id` to the `time_slots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minute` to the `time_slots` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."time_slots_day_hour_participant_id_key";

-- AlterTable
ALTER TABLE "public"."event" DROP COLUMN "description",
DROP COLUMN "end_date",
DROP COLUMN "start_date",
ADD COLUMN     "end_time" TEXT,
ADD COLUMN     "start_time" TEXT,
ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "public"."time_slots" DROP COLUMN "day",
ADD COLUMN     "event_date_id" TEXT NOT NULL,
ADD COLUMN     "fullDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "minute" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."event_dates" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "weekday" TEXT,

    CONSTRAINT "event_dates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_dates_eventId_date_weekday_key" ON "public"."event_dates"("eventId", "date", "weekday");

-- CreateIndex
CREATE UNIQUE INDEX "time_slots_event_date_id_hour_minute_fullDay_participant_id_key" ON "public"."time_slots"("event_date_id", "hour", "minute", "fullDay", "participant_id");

-- AddForeignKey
ALTER TABLE "public"."event_dates" ADD CONSTRAINT "event_dates_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."time_slots" ADD CONSTRAINT "time_slots_event_date_id_fkey" FOREIGN KEY ("event_date_id") REFERENCES "public"."event_dates"("id") ON DELETE CASCADE ON UPDATE CASCADE;
