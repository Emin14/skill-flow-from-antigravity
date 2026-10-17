ALTER TABLE "Task" ADD COLUMN "isProject" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Task" AS parent
SET "isProject" = true
WHERE EXISTS (
  SELECT 1
  FROM "Task" AS child
  WHERE child."parentTaskId" = parent."id"
);
