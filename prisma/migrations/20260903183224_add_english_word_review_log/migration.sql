-- CreateTable
CREATE TABLE "EnglishWordReviewLog" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnglishWordReviewLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnglishWordReviewLog_wordId_idx" ON "EnglishWordReviewLog"("wordId");

-- CreateIndex
CREATE INDEX "EnglishWordReviewLog_createdAt_idx" ON "EnglishWordReviewLog"("createdAt");
