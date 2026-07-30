/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `user_id` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `created_by` column on the `bookings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `company_id` column on the `mountains` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `sort_order` on the `season_mountains` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - The `company_id` column on the `seasons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `user_id` column on the `user_seasons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `company_id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_id,season_mountain_id]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[season_id,mountain_id]` on the table `season_mountains` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[season_id,sort_order]` on the table `season_mountains` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,year]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,season_id]` on the table `user_seasons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id,username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `whatsapp` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `companies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `location` to the `mountains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `season_mountains` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_date` to the `seasons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_date` to the `seasons` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `user_id` on the `user_credentials` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_created_by_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_season_mountain_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "mountains" DROP CONSTRAINT "mountains_company_id_fkey";

-- DropForeignKey
ALTER TABLE "season_mountains" DROP CONSTRAINT "season_mountains_mountain_id_fkey";

-- DropForeignKey
ALTER TABLE "season_mountains" DROP CONSTRAINT "season_mountains_season_id_fkey";

-- DropForeignKey
ALTER TABLE "seasons" DROP CONSTRAINT "seasons_company_id_fkey";

-- DropForeignKey
ALTER TABLE "user_credentials" DROP CONSTRAINT "user_credentials_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_seasons" DROP CONSTRAINT "user_seasons_season_id_fkey";

-- DropForeignKey
ALTER TABLE "user_seasons" DROP CONSTRAINT "user_seasons_user_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_company_id_fkey";

-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_pkey",
ADD COLUMN     "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID,
DROP COLUMN "created_by",
ADD COLUMN     "created_by" UUID,
ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
ADD COLUMN     "instagram" VARCHAR(100),
ADD COLUMN     "logo_url" VARCHAR(300),
ADD COLUMN     "primary_color" VARCHAR(7),
ADD COLUMN     "whatsapp" VARCHAR(20) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "mountains" ADD COLUMN     "general_description" TEXT,
ADD COLUMN     "image_url" VARCHAR(300),
ADD COLUMN     "location" VARCHAR(150) NOT NULL,
ADD COLUMN     "technical_description" TEXT,
DROP COLUMN "company_id",
ADD COLUMN     "company_id" UUID;

-- AlterTable
ALTER TABLE "season_mountains" ADD COLUMN     "end_date" DATE,
ADD COLUMN     "start_date" DATE NOT NULL,
ALTER COLUMN "sort_order" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "seasons" ADD COLUMN     "end_date" DATE NOT NULL,
ADD COLUMN     "start_date" DATE NOT NULL,
DROP COLUMN "company_id",
ADD COLUMN     "company_id" UUID;

-- AlterTable
ALTER TABLE "user_credentials" DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "user_seasons" ADD COLUMN     "enrolled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
DROP COLUMN "company_id",
ADD COLUMN     "company_id" UUID,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "idx_bookings_user" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "idx_bookings_season_mountain" ON "bookings"("season_mountain_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_user_id_season_mountain_id_key" ON "bookings"("user_id", "season_mountain_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "idx_mountains_company" ON "mountains"("company_id");

-- CreateIndex
CREATE INDEX "idx_sm_season" ON "season_mountains"("season_id");

-- CreateIndex
CREATE UNIQUE INDEX "season_mountains_season_id_mountain_id_key" ON "season_mountains"("season_id", "mountain_id");

-- CreateIndex
CREATE UNIQUE INDEX "season_mountains_season_id_sort_order_key" ON "season_mountains"("season_id", "sort_order");

-- CreateIndex
CREATE INDEX "idx_seasons_company" ON "seasons"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "seasons_company_id_year_key" ON "seasons"("company_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "user_credentials_user_id_key" ON "user_credentials"("user_id");

-- CreateIndex
CREATE INDEX "idx_us_user" ON "user_seasons"("user_id");

-- CreateIndex
CREATE INDEX "idx_us_season" ON "user_seasons"("season_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_seasons_user_id_season_id_key" ON "user_seasons"("user_id", "season_id");

-- CreateIndex
CREATE INDEX "idx_users_company" ON "users"("company_id");

-- CreateIndex
CREATE INDEX "idx_users_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_phone" ON "users"("phone");

-- CreateIndex
CREATE INDEX "idx_users_name" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_company_id_email_key" ON "users"("company_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_company_id_phone_key" ON "users"("company_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_company_id_username_key" ON "users"("company_id", "username");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_credentials" ADD CONSTRAINT "user_credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mountains" ADD CONSTRAINT "mountains_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season_mountains" ADD CONSTRAINT "season_mountains_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "season_mountains" ADD CONSTRAINT "season_mountains_mountain_id_fkey" FOREIGN KEY ("mountain_id") REFERENCES "mountains"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_seasons" ADD CONSTRAINT "user_seasons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_seasons" ADD CONSTRAINT "user_seasons_season_id_fkey" FOREIGN KEY ("season_id") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_season_mountain_id_fkey" FOREIGN KEY ("season_mountain_id") REFERENCES "season_mountains"("id") ON DELETE CASCADE ON UPDATE CASCADE;
