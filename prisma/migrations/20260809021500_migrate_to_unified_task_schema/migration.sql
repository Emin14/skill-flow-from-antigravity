-- Migration: 20260809021500_migrate_to_unified_task_schema
-- Goal: Safe migration to Unified Task Schema preserving existing Task and TaskOccurrence data

-- Step 1: Create Tag table
CREATE TABLE IF NOT EXISTS "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateUniqueIndex for Tag.name
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag"("name");

-- Step 2: Create implicit join table _TaskTags for Task <-> Tag relation
CREATE TABLE IF NOT EXISTS "_TaskTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskTags_AB_pkey" PRIMARY KEY ("A","B")
);

CREATE INDEX IF NOT EXISTS "_TaskTags_B_index" ON "_TaskTags"("B");

-- Add foreign keys for _TaskTags
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_TaskTags_A_fkey'
    ) THEN
        ALTER TABLE "_TaskTags" ADD CONSTRAINT "_TaskTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = '_TaskTags_B_fkey'
    ) THEN
        ALTER TABLE "_TaskTags" ADD CONSTRAINT "_TaskTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Step 3: Add new columns to TaskOccurrence safely
ALTER TABLE "TaskOccurrence" ADD COLUMN IF NOT EXISTS "note" TEXT;
ALTER TABLE "TaskOccurrence" ADD COLUMN IF NOT EXISTS "startedAt" TIMESTAMP(3);
ALTER TABLE "TaskOccurrence" ADD COLUMN IF NOT EXISTS "activeMinutes" DOUBLE PRECISION DEFAULT 0;
ALTER TABLE "TaskOccurrence" ADD COLUMN IF NOT EXISTS "smartRating" TEXT;

-- Step 4: Update foreign key on Task.parentTaskId to ON DELETE SET NULL
ALTER TABLE "Task" DROP CONSTRAINT IF EXISTS "Task_parentTaskId_fkey";
ALTER TABLE "Task" ADD CONSTRAINT "Task_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "Task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Step 5: DATA MIGRATION — Transfer existing Task.scheduledDate & Task.status to TaskOccurrence
-- For any existing Task record that does NOT have an occurrence entry yet, create one from scheduledDate and status.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'Task' AND column_name = 'scheduledDate'
    ) THEN
        INSERT INTO "TaskOccurrence" ("id", "taskId", "date", "status", "completedAt", "pomodorosCount", "activeMinutes")
        SELECT 
            gen_random_uuid()::text,
            t."id",
            COALESCE(t."scheduledDate", TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD')),
            COALESCE(t."status", 'Todo'),
            CASE WHEN t."status" = 'Done' THEN CURRENT_TIMESTAMP ELSE NULL END,
            1,
            0
        FROM "Task" t
        WHERE NOT EXISTS (
            SELECT 1 FROM "TaskOccurrence" o WHERE o."taskId" = t."id"
        );
    END IF;
END $$;

-- Step 6: Safely DROP old stored columns from Task AFTER data migration
ALTER TABLE "Task" DROP COLUMN IF EXISTS "scheduledDate";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "status";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "repeatStatus";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "hasSubtasks";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "repetitionsCount";
ALTER TABLE "Task" DROP COLUMN IF EXISTS "lastSmartRating";
