-- CreateTable
CREATE TABLE "EnglishWordProgress" (
    "wordId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "nextReviewDate" TEXT NOT NULL,
    "intervalDays" INTEGER NOT NULL DEFAULT 1,
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnglishWordProgress_pkey" PRIMARY KEY ("wordId")
);

-- CreateTable
CREATE TABLE "EnglishSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "dailyNewWords" INTEGER NOT NULL DEFAULT 5,
    "maxReviewsPerDay" INTEGER NOT NULL DEFAULT 30,
    "activeLevels" TEXT NOT NULL DEFAULT '["A1","A2","B1","B2"]',
    "autoPronounce" BOOLEAN NOT NULL DEFAULT true,
    "accent" TEXT NOT NULL DEFAULT 'us',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnglishSettings_pkey" PRIMARY KEY ("id")
);
