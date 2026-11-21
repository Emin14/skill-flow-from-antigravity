-- Per-date word goal, so extra words requested from the "today is done" panel
-- survive closing the trainer and are served by the session endpoint.
CREATE TABLE "EnglishDayGoal" (
    "date" TEXT NOT NULL,
    "goalCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnglishDayGoal_pkey" PRIMARY KEY ("date")
);
