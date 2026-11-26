#!/usr/bin/env bash
# Скрипт деплоя. Запускается экшеном appleboy/ssh-action с script_stop: true,
# а тот разбивает скрипт ПОСТРОЧНО и после КАЖДОЙ строки вставляет
# `DRONE_SSH_PREV_COMMAND_EXIT_CODE=$?; if [ ... -ne 0 ]; then exit ...; fi;`
#
# Следствие: любая строка, которая в штатном сценарии возвращает не 0
# (например `[ "$code" = "200" ] && break` в цикле ожидания), обрывает деплой.
# Поэтому здесь нет конструкций с неявным кодом возврата: только if/then,
# а цикл ожидания заключён в функцию, вызываемую как отдельный статус.
set -euo pipefail

cd /opt/skillflow

BACKUP_SCRIPT=/opt/skillflow/scripts/backup-db.sh
APP_URL=http://127.0.0.1:3000/

# --- 1. Бэкап ДО любых изменений схемы -------------------------------------
# Провал бэкапа останавливает деплой: без точки отката миграции не применяем.
if [ -x "$BACKUP_SCRIPT" ]; then
  "$BACKUP_SCRIPT"
else
  echo "::error::backup script not found at $BACKUP_SCRIPT"
  exit 1
fi

# --- 2. Образы --------------------------------------------------------------
# Обычно их уже скачал шаг "Pre-pull images on VPS" (у него свой таймаут).
# Здесь pull оставлен только как догоняющий: если образ уже в кэше, это
# несколько секунд метаданных, а не повторная загрузка. Так деплой остаётся
# работоспособным и при ручном запуске скрипта на сервере.
docker compose pull app
docker compose pull migrate

# --- 3. База и миграции -----------------------------------------------------
docker compose up -d postgres
docker compose run --rm migrate

# --- 4. Приложение ----------------------------------------------------------
docker compose up -d --no-deps app

# --- 5. Проверка живости ----------------------------------------------------
# Возвращает 0 при 200, 1 по таймауту. Вызывается в if/then, чтобы код
# возврата не ронял деплой через вставки script_stop.
wait_for_app() {
  local i code
  for i in $(seq 1 30); do
    code=$(curl -s -o /dev/null -w '%{http_code}' "$APP_URL" || true)
    if [ "$code" = "200" ]; then
      echo "app responded 200 on attempt $i"
      return 0
    fi
    sleep 2
  done
  echo "last HTTP status: ${code:-none}"
  return 1
}

if wait_for_app; then
  echo "app is healthy"
else
  echo "::error::app did not become healthy"
  docker compose logs --tail=50 app
  exit 1
fi

# --- 6. Уборка старых образов -----------------------------------------------
# Каждый деплой иначе оставляет ~2.7 GB dangling (latest + migrate прошлой сборки).
docker image prune -f
