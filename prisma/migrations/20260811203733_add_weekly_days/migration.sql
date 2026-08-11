/*
  Warnings:

  - You are about to alter the column `currentIntervalDays` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "weeklyDays" TEXT,
ALTER COLUMN "priority" DROP NOT NULL,
ALTER COLUMN "repetitionMode" DROP DEFAULT,
ALTER COLUMN "currentIntervalDays" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "TaskOccurrence" ALTER COLUMN "pomodorosCount" SET DEFAULT 0;
