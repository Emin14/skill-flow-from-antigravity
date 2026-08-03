'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getTodayStr } from '@/shared/lib/dateUtils';

/**
 * shared/hooks/useMidnightRefresh.ts
 *
 * Запускает callback каждые 30 секунд когда дата переходит через полночь.
 * Используется в TodayTasks, CalendarPage и других компонентах
 * вместо дублированного паттерна setInterval.
 */
export const useMidnightRefresh = (onNewDay: () => void): void => {
  const dateRef = useRef<string>(getTodayStr());
  const callbackRef = useRef(onNewDay);
  callbackRef.current = onNewDay;

  useEffect(() => {
    const interval = setInterval(() => {
      const nowStr = getTodayStr();
      if (nowStr !== dateRef.current) {
        dateRef.current = nowStr;
        callbackRef.current();
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, []); // Намеренно пустой: интервал запускается один раз
};
