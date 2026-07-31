/*
  Warnings:

  - A unique constraint covering the columns `[company_id,year,name]` on the table `seasons` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "seasons_company_id_year_key";

-- AlterTable
ALTER TABLE "mountains" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ALTER COLUMN "altitude_meters" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "seasons_company_id_year_name_key" ON "seasons"("company_id", "year", "name");
