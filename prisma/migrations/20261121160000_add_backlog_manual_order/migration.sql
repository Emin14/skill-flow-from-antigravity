-- Manual ordering for notes, kept separate from "sortOrder" because that column
-- already encodes pinning as a negative number and must not be repurposed.
-- Null means "never moved by hand" — such notes keep the date-based order, so
-- existing boards look unchanged after this migration.
ALTER TABLE "BacklogItem" ADD COLUMN "manualOrder" INTEGER;

CREATE INDEX "BacklogItem_topicId_manualOrder_idx" ON "BacklogItem"("topicId", "manualOrder");
