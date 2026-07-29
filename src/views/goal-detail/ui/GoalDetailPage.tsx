'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Typography, Progress, Button, Input } from '@/shared/ui';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore, TopicTree, calculateGoalProgress } from '@/entities/topic';
import { useTaskStore } from '@/entities/task';

interface GoalDetailPageProps {
  goalId: string;
}

export const GoalDetailPage: React.FC<GoalDetailPageProps> = ({ goalId }) => {
  const { goals, fetchGoals } = useGoalStore();
  const { topics, fetchTopics, addTopic, deleteTopic } = useTopicStore();
  const { tasks, fetchTasks } = useTaskStore();

  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string | null>(null);
  const [topicTitle, setTopicTitle] = useState('');

  useEffect(() => {
    fetchGoals();
    fetchTopics();
    fetchTasks();
  }, [fetchGoals, fetchTopics, fetchTasks]);

  const goal = goals.find((g) => g.id === goalId);

  if (!goal) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="h2" style={{ marginBottom: 'var(--space-3)' }}>
            Цель не найдена
          </Typography>
          <Link href="/goals" style={{ textDecoration: 'none' }}>
            <Button variant="primary">← Вернуться к списку целей</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const goalProgress = calculateGoalProgress(goal.id, topics, tasks);
  const goalTopics = topics.filter((t) => t.goalId === goal.id);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicTitle.trim()) return;

    await addTopic(topicTitle.trim(), goal.id, targetParentId);
    setTopicTitle('');
    setIsAddingTopic(false);
    setTargetParentId(null);
  };

  const openAddSubtopicModal = (parentId: string) => {
    setTargetParentId(parentId);
    setIsAddingTopic(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '950px', margin: '0 auto' }}>
      {/* Back Link */}
      <div>
        <Link href="/goals" style={{ textDecoration: 'none' }}>
          <Typography variant="caption" style={{ color: 'var(--color-accent)', cursor: 'pointer' }}>
            ← Назад к списку целей
          </Typography>
        </Link>
      </div>

      {/* Goal Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: goal.color }} />
            <Typography variant="h1">{goal.title}</Typography>
          </div>
          <Typography variant="h2" style={{ color: goalProgress === 100 ? 'var(--color-success)' : 'var(--color-accent)' }}>
            {goalProgress}%
          </Typography>
        </div>

        {goal.description && (
          <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
            {goal.description}
          </Typography>
        )}

        <Progress value={goalProgress} height={8} color={goal.color} />
      </Card>

      {/* Topics Hierarchy Header & Add Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h2">🌳 Карта Навыков и Тем</Typography>
        <Button
          variant="primary"
          onClick={() => {
            setTargetParentId(null);
            setIsAddingTopic(true);
          }}
        >
          ➕ Добавить главную тему
        </Button>
      </div>

      {/* Create Topic Form */}
      {isAddingTopic && (
        <Card style={{ border: '1px solid var(--color-accent)' }}>
          <Typography variant="h3" style={{ marginBottom: 'var(--space-3)' }}>
            {targetParentId ? '➕ Новая подтема' : '➕ Новая главная тема'}
          </Typography>
          <form onSubmit={handleCreateTopic} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Название темы (например: PostgreSQL, React, Animations)"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                required
              />
            </div>
            <Button type="button" variant="secondary" onClick={() => setIsAddingTopic(false)}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" disabled={!topicTitle.trim()}>
              Сохранить
            </Button>
          </form>
        </Card>
      )}

      {/* Topic Tree View */}
      {goalTopics.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
            🌱 У этой цели пока нет добавленных тем
          </Typography>
          <Button variant="primary" onClick={() => setIsAddingTopic(true)}>
            ➕ Добавить первую тему
          </Button>
        </Card>
      ) : (
        <Card style={{ padding: 'var(--space-5)' }}>
          <TopicTree
            goalId={goal.id}
            allTopics={topics}
            allTasks={tasks}
            onAddSubtopic={openAddSubtopicModal}
            onDeleteTopic={deleteTopic}
          />
        </Card>
      )}
    </div>
  );
};
