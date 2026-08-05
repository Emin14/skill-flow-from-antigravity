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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <Typography variant="h2">📜 Последняя активность</Typography>
        {logs.length > 0 && (
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 500, opacity: 0.75 }}>
            Прокрутите вниз, чтобы увидеть всю историю
          </span>
        )}
      </div>

      {logs.length === 0 ? (
        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
          🌱 Действий пока не зафиксировано.
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '210px',
            overflowY: 'auto',
            paddingRight: '4px',
            scrollbarWidth: 'thin',
          }}
        >
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 'var(--font-size-sm)',
                padding: '8px 12px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-surface-hover)',
                border: '1px solid var(--color-border)',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <span style={{ flexShrink: 0 }}>{activityIcons[log.type] || '⚡'}</span>
                <span style={{ color: 'var(--color-text-primary)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {log.title}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', flexShrink: 0, marginLeft: '8px' }}>
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
