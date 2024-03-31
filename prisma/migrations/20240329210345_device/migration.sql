/*
  Warnings:

  - You are about to drop the column `macAddress` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Device` table. All the data in the column will be lost.
  - The `os` column on the `Device` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OS" AS ENUM ('iOS', 'linux', 'windows', 'macOS', 'android');

-- AlterTable
ALTER TABLE "Device" DROP COLUMN "macAddress",
DROP COLUMN "type",
ALTER COLUMN "name" SET DEFAULT 'Device',
DROP COLUMN "os",
ADD COLUMN     "os" "OS" NOT NULL DEFAULT 'android';
