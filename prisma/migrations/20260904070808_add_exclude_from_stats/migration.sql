-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "excludeFromStats" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "excludeFromStats" BOOLEAN NOT NULL DEFAULT false;
