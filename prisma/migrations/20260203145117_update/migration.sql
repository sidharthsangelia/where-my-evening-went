/*
  Warnings:

  - You are about to drop the column `text` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `audioUrl` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "text",
ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "mood" TEXT,
ADD COLUMN     "transcript" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aiOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiOptInAt" TIMESTAMP(3),
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Entry_userId_date_idx" ON "Entry"("userId", "date");
