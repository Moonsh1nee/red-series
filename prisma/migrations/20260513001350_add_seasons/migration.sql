/*
  Warnings:

  - You are about to drop the column `series_id` on the `episodes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[seasonId,number]` on the table `episodes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seasonId` to the `episodes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "episodes" DROP CONSTRAINT "episodes_series_id_fkey";

-- DropIndex
DROP INDEX "episodes_series_id_number_key";

-- AlterTable
ALTER TABLE "episodes" DROP COLUMN "series_id",
ADD COLUMN     "seasonId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "seasons" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT,
    "seriesId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seasons_seriesId_number_key" ON "seasons"("seriesId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "episodes_seasonId_number_key" ON "episodes"("seasonId", "number");

-- AddForeignKey
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "seasons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
