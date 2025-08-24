-- AlterTable
ALTER TABLE "public"."event" ADD COLUMN     "folder_id" TEXT;

-- CreateTable
CREATE TABLE "public"."folder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "folder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."event" ADD CONSTRAINT "event_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."folder" ADD CONSTRAINT "folder_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
