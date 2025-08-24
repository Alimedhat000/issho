/*
  Warnings:

  - A unique constraint covering the columns `[name,user_id]` on the table `folder` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "folder_name_user_id_key" ON "public"."folder"("name", "user_id");
