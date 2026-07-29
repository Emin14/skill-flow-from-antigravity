'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Card, Typography, Button } from '@/shared/ui';
import { Material } from '@/entities/material/model/types';
import { Topic } from '@/entities/topic/model/types';

interface TodayMaterialsProps {
  materials: Material[];
  topics: Topic[];
}

export const TodayMaterials: React.FC<TodayMaterialsProps> = memo(({
  materials,
  topics,
}) => {
  const recentMaterials = materials.slice(0, 3);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Typography variant="h2">📚 Продолжить обучение</Typography>

      {recentMaterials.length === 0 ? (
        <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
          🌱 Нет открытых материалов. Перейдите в тему и создайте первый конспект!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {recentMaterials.map((mat) => {
            const topic = topics.find((t) => t.id === mat.topicId);

            return (
              <div
                key={mat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/materials/${mat.id}`}
                    style={{
                      fontSize: 'var(--font-size-md)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      textDecoration: 'none',
                    }}
                  >
                    📄 {mat.title}
                  </Link>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    {topic ? `🐘 Тема: ${topic.title} • ` : ''} ⏱ {mat.readTimeMinutes || 5} мин
                  </span>
                </div>

                <Link href={`/materials/${mat.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="secondary" size="sm">
                    Читать ➔
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
});

TodayMaterials.displayName = 'TodayMaterials';
