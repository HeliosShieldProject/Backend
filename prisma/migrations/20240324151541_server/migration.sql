/*
  Warnings:

  - You are about to drop the column `serverUri` on the `Server` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[backendUri]` on the table `Server` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[wireguardUri]` on the table `Server` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `backendUri` to the `Server` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wireguardUri` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Server" DROP COLUMN "serverUri",
ADD COLUMN     "backendUri" TEXT NOT NULL,
ADD COLUMN     "wireguardUri" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Server_backendUri_key" ON "Server"("backendUri");

-- CreateIndex
CREATE UNIQUE INDEX "Server_wireguardUri_key" ON "Server"("wireguardUri");
