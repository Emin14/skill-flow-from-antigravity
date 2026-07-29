'use client';

import React, { memo } from 'react';
import { Card, Typography } from '@/shared/ui';
import { ActivityLog } from '@/entities/activity/model/types';

interface TodayActivityProps {
  logs: ActivityLog[];
}

const activityIcons: Record<string, string> = {
  task_created: '➕',
  task_completed: '✅',
  material_completed: '📚',
  fsrs_reviewed: '🧠',
  goal_created: '🏆',
  topic_created: '🐘',
};

export const TodayActivity: React.FC<TodayActivityProps> = memo(({ logs }) => {
  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Typography variant="h2">📜 Последняя активность (20 событий)</Typography>

      {logs.length === 0 ? (
        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
          🌱 Действий пока не зафиксировано.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 'var(--font-size-sm)',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <span>{activityIcons[log.type] || '⚡'}</span>
                <span style={{ color: 'var(--color-text-primary)' }}>{log.title}</span>
              </div>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {new Date(log.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});

TodayActivity.displayName = 'TodayActivity';
