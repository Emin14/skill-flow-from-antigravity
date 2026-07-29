import React from 'react';
import { Card, Typography } from '@/shared/ui';

export const CalendarPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <Typography variant="h2" style={{ marginBottom: '8px' }}>📅 Календарь и Планирование</Typography>
        <Typography variant="body" style={{ color: '#94a3b8' }}>Расписание и тайм-блокинг задач</Typography>
      </Card>

      <Card>
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
          🗓 Сетка календаря готова к реализации
        </div>
      </Card>
    </div>
  );
};
