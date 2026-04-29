/*
  Warnings:

  - You are about to drop the column `rating` on the `series` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "series" DROP COLUMN "rating",
ADD COLUMN     "rating_age" TEXT;
