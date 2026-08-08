-- Migration: 20260809030000_fix_task_state_for_repeating_tasks
-- Goal: Safely restore taskState for existing repeating tasks whose repeatStatus was dropped without transfer

-- Step 1: Set taskState = 'active' for repeating standalone tasks where taskState IS NULL
UPDATE "Task"
SET "taskState" = 'active'
WHERE "isRepeating" = true 
  AND "parentTaskId" IS NULL 
  AND "taskState" IS NULL;

-- Step 2: Enforce strict schema rules: for non-repeating tasks or subtasks, ensure taskState = NULL and isRepeating = false
UPDATE "Task"
SET "taskState" = NULL
WHERE "isRepeating" = false OR "parentTaskId" IS NOT NULL;

UPDATE "Task"
SET "isRepeating" = false
WHERE "parentTaskId" IS NOT NULL;
