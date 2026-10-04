BEGIN;

-- Retain every existing note and legacy topic name; only add persistent relations.
LOCK TABLE "BacklogItem" IN ACCESS EXCLUSIVE MODE;

CREATE TABLE "BacklogTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BacklogTopic_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "BacklogTopic_name_key" ON "BacklogTopic"("name");

INSERT INTO "BacklogTopic" ("id", "name", "sortOrder", "createdAt", "updatedAt")
SELECT 'backlog-topic-' || md5("topic"), "topic",
       (row_number() OVER (ORDER BY "topic") - 1)::INTEGER,
       min("createdAt"), max("updatedAt")
FROM "BacklogItem"
GROUP BY "topic";

ALTER TABLE "BacklogItem" ADD COLUMN "topicId" TEXT;
UPDATE "BacklogItem" AS item
SET "topicId" = topic."id"
FROM "BacklogTopic" AS topic
WHERE topic."name" = item."topic";

-- An unmatched note aborts the entire migration instead of being dropped or regrouped.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "BacklogItem" WHERE "topicId" IS NULL) THEN
    RAISE EXCEPTION 'Backlog topic migration left unassigned notes';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "BacklogItem" item JOIN "BacklogTopic" topic ON topic."id" = item."topicId"
    WHERE item."topic" IS DISTINCT FROM topic."name"
  ) THEN
    RAISE EXCEPTION 'Backlog topic migration changed note grouping';
  END IF;
  RAISE NOTICE 'Backlog topic migration: % notes linked to % topics',
    (SELECT count(*) FROM "BacklogItem"), (SELECT count(*) FROM "BacklogTopic");
END $$;

ALTER TABLE "BacklogItem" ALTER COLUMN "topicId" SET NOT NULL;
ALTER TABLE "BacklogItem" ADD CONSTRAINT "BacklogItem_topicId_fkey"
FOREIGN KEY ("topicId") REFERENCES "BacklogTopic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "BacklogItem_topicId_idx" ON "BacklogItem"("topicId");

-- Support the previous app while migrate deploy runs before the new app starts.
CREATE FUNCTION sync_backlog_topic_relation() RETURNS TRIGGER AS $$
DECLARE resolved_id TEXT;
BEGIN
  IF NEW."topicId" IS NULL OR
     (TG_OP = 'UPDATE' AND NEW."topic" IS DISTINCT FROM OLD."topic" AND NEW."topicId" = OLD."topicId") THEN
    INSERT INTO "BacklogTopic" ("id", "name")
    VALUES (gen_random_uuid()::text, NEW."topic")
    ON CONFLICT ("name") DO UPDATE SET "name" = EXCLUDED."name"
    RETURNING "id" INTO resolved_id;
    NEW."topicId" := resolved_id;
  END IF;
  SELECT "name" INTO NEW."topic" FROM "BacklogTopic" WHERE "id" = NEW."topicId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "BacklogItem_sync_topic"
BEFORE INSERT OR UPDATE ON "BacklogItem"
FOR EACH ROW EXECUTE FUNCTION sync_backlog_topic_relation();

COMMIT;
