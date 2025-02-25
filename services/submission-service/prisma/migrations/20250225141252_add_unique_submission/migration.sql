/*
  Warnings:

  - You are about to drop the column `feedbackPath` on the `Submission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignmentId,studentId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "feedbackPath";

-- CreateIndex
CREATE UNIQUE INDEX "Submission_assignmentId_studentId_key" ON "Submission"("assignmentId", "studentId");
