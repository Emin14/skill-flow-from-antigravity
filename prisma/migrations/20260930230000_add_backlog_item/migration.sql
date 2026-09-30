-- CreateTable
CREATE TABLE "BacklogItem" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'idea',
    "priority" TEXT DEFAULT 'medium',
    "tags" TEXT,
    "link" TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BacklogItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BacklogItem_topic_idx" ON "BacklogItem"("topic");

-- CreateIndex
CREATE INDEX "BacklogItem_status_idx" ON "BacklogItem"("status");
