/*
  Warnings:

  - You are about to drop the column `content` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[filePath]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherId` to the `Assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_submissionId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "teacherId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "content",
DROP COLUMN "feedback",
DROP COLUMN "submittedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "feedbackPath" TEXT,
ADD COLUMN     "filePath" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Attachment";

-- CreateIndex
CREATE INDEX "Assignment_teacherId_idx" ON "Assignment"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_filePath_key" ON "Submission"("filePath");
