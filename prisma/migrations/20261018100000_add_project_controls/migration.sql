ALTER TABLE "Task" ADD COLUMN "projectStatus" TEXT;
ALTER TABLE "Task" ADD COLUMN "projectPinned" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Task" ADD COLUMN "projectArchivedAt" TIMESTAMP(3);

UPDATE "Task" AS parent
SET "projectStatus" = 'planned'
WHERE "isProject" = true AND "projectStatus" IS NULL;
