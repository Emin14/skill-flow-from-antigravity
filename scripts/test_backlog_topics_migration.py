"""Exercise the actual migration in disposable PostgreSQL with synthetic notes only."""
from pathlib import Path
import re
import subprocess
import time

ROOT = Path(__file__).resolve().parents[1]

FIXTURES = """
INSERT INTO "BacklogItem" ("id", "topic", "title", "description", "tags", "sortOrder", "createdAt", "updatedAt") VALUES
('a', 'Сайт', 'Первый', 'Строка 1' || chr(10) || 'Строка 2', '["UI"]', -1, '2026-09-01', '2026-10-01'),
('b', 'Сайт', 'Второй', NULL, NULL, 7, '2026-09-02', '2026-10-02'),
('c', 'сайт', 'Регистр', '', '[]', 0, '2026-09-03', '2026-10-03'),
('d', ' Сайт ', 'Пробелы', 'Не объединять', '[]', 0, '2026-09-04', '2026-10-04'),
('e', 'Общее', 'Ссылка', 'Текст', '["one","two"]', 0, '2026-09-05', '2026-10-04');
CREATE TABLE test_before AS SELECT * FROM "BacklogItem";
"""

CHECKS = """
DO $$ BEGIN
  IF (SELECT count(*) FROM "BacklogItem") <> 5 THEN RAISE EXCEPTION 'Note count changed'; END IF;
  IF (SELECT count(*) FROM "BacklogTopic") <> 4 THEN RAISE EXCEPTION 'Distinct topics merged'; END IF;
  IF EXISTS (SELECT 1 FROM test_before b FULL JOIN "BacklogItem" i USING ("id") WHERE to_jsonb(b) IS DISTINCT FROM (to_jsonb(i) - 'topicId')) THEN RAISE EXCEPTION 'Original note fields, IDs or dates changed'; END IF;
  IF EXISTS (SELECT 1 FROM "BacklogItem" i JOIN "BacklogTopic" t ON i."topicId"=t."id" WHERE i."topic" <> t."name") THEN RAISE EXCEPTION 'Incorrect relation'; END IF;
END $$;
UPDATE "BacklogTopic" SET "name"='Переименованный сайт' WHERE "name"='Сайт';
DO $$ BEGIN
  IF (SELECT count(*) FROM "BacklogItem" i JOIN "BacklogTopic" t ON i."topicId"=t."id" WHERE t."name"='Переименованный сайт') <> 2 THEN RAISE EXCEPTION 'Rename lost notes'; END IF;
END $$;
-- Old app can still insert under a name which has since been renamed.
INSERT INTO "BacklogItem" ("id", "topic", "title") VALUES ('legacy', 'Сайт', 'Старая версия');
UPDATE "BacklogItem" SET "topic"='Другая тема' WHERE "id"='legacy';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM "BacklogItem" i JOIN "BacklogTopic" t ON t."id"=i."topicId" WHERE i."id"='legacy' AND t."name"='Другая тема') THEN RAISE EXCEPTION 'Legacy write lost relation'; END IF;
  BEGIN
    DELETE FROM "BacklogTopic" WHERE "name"='Переименованный сайт';
    RAISE EXCEPTION 'Deleting populated topic was allowed';
  EXCEPTION WHEN foreign_key_violation THEN NULL;
  END;
END $$;
UPDATE "BacklogTopic" SET "archivedAt"=CURRENT_TIMESTAMP WHERE "name"='Переименованный сайт';
DO $$ BEGIN
  IF (SELECT count(*) FROM "BacklogItem" i JOIN "BacklogTopic" t ON i."topicId"=t."id" WHERE t."archivedAt" IS NOT NULL) <> 2 THEN RAISE EXCEPTION 'Archive lost notes'; END IF;
END $$;
DELETE FROM "BacklogItem" WHERE "id"='c';
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM "BacklogTopic" WHERE "name"='сайт') THEN RAISE EXCEPTION 'Empty topic disappeared'; END IF;
END $$;
"""

def run(*args, input=None):
    return subprocess.run(args, input=input, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True)

def main():
    container = run('docker', 'run', '--detach', '--rm', '--env', 'POSTGRES_PASSWORD=topic_test_only', 'postgres:16-alpine').stdout.decode().strip()
    if not re.fullmatch(r'[0-9a-f]{64}', container):
        raise RuntimeError('Unexpected test container ID')
    try:
        for attempt in range(30):
            ready = subprocess.run(['docker', 'exec', container, 'pg_isready', '-U', 'postgres'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if ready.returncode == 0:
                break
            time.sleep(0.5)
        else:
            raise RuntimeError('Test database did not start')
        old_schema = (ROOT / 'prisma/migrations/20260930230000_add_backlog_item/migration.sql').read_text(encoding='utf-8')
        migration = (ROOT / 'prisma/migrations/20261004120000_independent_backlog_topics/migration.sql').read_text(encoding='utf-8')
        run('docker', 'exec', '-i', container, 'psql', '-U', 'postgres', '-v', 'ON_ERROR_STOP=1', input=(old_schema + FIXTURES + migration + CHECKS).encode())
        print('PASS: note preservation, exact topic names, stable IDs, legacy writes, rename, archive, protected deletion, empty topics.')
    except subprocess.CalledProcessError as error:
        print(error.stderr.decode('utf-8', errors='replace'))
        raise
    finally:
        run('docker', 'stop', container)

if __name__ == '__main__':
    main()
