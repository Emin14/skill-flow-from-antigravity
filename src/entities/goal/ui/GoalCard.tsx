'use client';

import React from 'react';
import Link from 'next/link';
import { Goal } from '../model/types';
import { Topic } from '@/entities/topic/model/types';
import { Task } from '@/entities/task/model/types';
import { Material } from '@/entities/material/model/types';
import { calculateGoalProgress } from '@/entities/topic/lib/calculateCascade';
import { Card, Typography, Progress, Button } from '@/shared/ui';

interface GoalCardProps {
  goal: Goal;
  allTopics: Topic[];
  allTasks: Task[];
  allMaterials?: Material[];
  onArchiveGoal?: (id: string) => void;
  onDeleteGoal?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  allTopics,
  allTasks,
  allMaterials = [],
  onArchiveGoal,
  onDeleteGoal,
}) => {
  const goalProgress = calculateGoalProgress(goal.id, allTopics, allTasks, allMaterials);
  const goalTopics = allTopics.filter((t) => t.goalId === goal.id);

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: goal.color || '#6366f1',
            }}
          />
          <Link
            href={`/goals/${goal.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Typography variant="h2" style={{ cursor: 'pointer' }}>
              {goal.title}
            </Typography>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {onArchiveGoal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchiveGoal(goal.id)}
              title="В архив"
            >
              📦 В архив
            </Button>
          )}
          {onDeleteGoal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm(`Вы действительно хотите удалить цель "${goal.title}"?`)) {
                  onDeleteGoal(goal.id);
                }
              }}
              title="Удалить цель"
              style={{ color: 'var(--color-text-muted)' }}
            >
              🗑
            </Button>
          )}
        </div>
      </div>

      {goal.description && (
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          {goal.description}
        </Typography>
      )}

      {/* Progress & Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption">
            {goalTopics.length} тем всего
          </Typography>
          <Typography variant="h3" style={{ color: goalProgress === 100 ? 'var(--color-success)' : 'var(--color-accent)' }}>
            {goalProgress}%
          </Typography>
        </div>
        <Progress value={goalProgress} height={8} color={goal.color} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
        <Link href={`/goals/${goal.id}`} style={{ textDecoration: 'none' }}>
          <Button variant="secondary" size="sm">
            Открыть карту тем ➔
          </Button>
        </Link>
      </div>
    </Card>
  );
};
