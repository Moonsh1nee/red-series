/*
  Warnings:

  - A unique constraint covering the columns `[series_id,number]` on the table `episodes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "episodes_series_id_number_key" ON "episodes"("series_id", "number");
