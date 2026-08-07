-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Todo',
    "priority" TEXT NOT NULL DEFAULT 'P2',
    "category" TEXT NOT NULL,
    "description" TEXT,
    "link" TEXT,
    "parentTaskId" TEXT,
    "scheduledDate" TEXT NOT NULL,
    "isRepeating" BOOLEAN NOT NULL DEFAULT false,
    "repeatStatus" TEXT DEFAULT 'Active',
    "repetitionMode" TEXT DEFAULT 'smart',
    "scheduleFrequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskOccurrence" (
    "id" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Todo',
    "completedAt" TIMESTAMP(3),
    "pomodorosCount" DOUBLE PRECISION,

    CONSTRAINT "TaskOccurrence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskOccurrence" ADD CONSTRAINT "TaskOccurrence_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
