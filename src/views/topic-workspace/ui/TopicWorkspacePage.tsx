'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Typography, Progress, Button, Input, Textarea, Checkbox } from '@/shared/ui';
import { useTopicStore, calculateTopicProgress } from '@/entities/topic';
import { useGoalStore } from '@/entities/goal';
import { useTaskStore } from '@/entities/task';
import { useMaterialStore } from '@/entities/material';
import { TaskPriority } from '@/entities/task/model/types';
import styles from './TopicWorkspacePage.module.css';

interface TopicWorkspacePageProps {
  topicId: string;
}

export const TopicWorkspacePage: React.FC<TopicWorkspacePageProps> = ({ topicId }) => {
  const { topics, fetchTopics } = useTopicStore();
  const { goals, fetchGoals } = useGoalStore();
  const { tasks, fetchTasks, addTask, toggleTaskStatus, deleteTask } = useTaskStore();
  const { materials, fetchMaterials, addMaterial, toggleCompletedMaterial, deleteMaterial } = useMaterialStore();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('P3');

  // New Material form state
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [matTitle, setMatTitle] = useState('');
  const [matDescription, setMatDescription] = useState('');

  useEffect(() => {
    fetchTopics();
    fetchGoals();
    fetchTasks();
    fetchMaterials();
  }, [fetchTopics, fetchGoals, fetchTasks, fetchMaterials]);

  const topic = topics.find((t) => t.id === topicId);
  const parentGoal = topic ? goals.find((g) => g.id === topic.goalId) : null;

  if (!topic) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="h2" style={{ marginBottom: 'var(--space-3)' }}>
            Тема не найдена
          </Typography>
          <Link href="/goals" style={{ textDecoration: 'none' }}>
            <Button variant="primary">← Вернуться к целям</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const topicProgress = calculateTopicProgress(topic.id, topics, tasks, materials);
  const topicTasks = tasks.filter((t) => t.topicId === topic.id);
  const topicMaterials = materials.filter((m) => m.topicId === topic.id);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const created = await addTask(newTaskTitle.trim(), priority);
    const { taskRepository } = await import('@/shared/repository');
    await taskRepository.update(created.id, { topicId: topic.id, goalId: topic.goalId });
    await fetchTasks();

    setNewTaskTitle('');
  };

  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle.trim()) return;

    await addMaterial(topic.id, matTitle.trim(), matDescription.trim());
    setMatTitle('');
    setMatDescription('');
    setIsAddingMaterial(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '950px', margin: '0 auto' }}>
      {/* Back Link */}
      <div>
        <Link href={parentGoal ? `/goals/${parentGoal.id}` : '/goals'} style={{ textDecoration: 'none' }}>
          <Typography variant="caption" style={{ color: 'var(--color-accent)', cursor: 'pointer' }}>
            ← Назад к цели: {parentGoal ? parentGoal.title : 'Цели'}
          </Typography>
        </Link>
      </div>

      {/* Topic Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h1">🐘 {topic.title}</Typography>
            <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Рабочая область темы ({topicTasks.length} задач, {topicMaterials.length} материалов)
            </Typography>
          </div>
          <Typography variant="h2" style={{ color: topicProgress === 100 ? 'var(--color-success)' : 'var(--color-accent)' }}>
            {topicProgress}%
          </Typography>
        </div>

        <Progress value={topicProgress} height={8} />
      </Card>

      {/* Educational Materials Section */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h2">📚 Учебные материалы темы ({topicMaterials.length})</Typography>
          <Button variant="primary" onClick={() => setIsAddingMaterial(!isAddingMaterial)}>
            {isAddingMaterial ? 'Отмена' : '➕ Добавить материал'}
          </Button>
        </div>

        {/* Create Material Form */}
        {isAddingMaterial && (
          <form onSubmit={handleCreateMaterial} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <Input
              label="Название материала"
              placeholder="Например: Введение в Postgres Indexing"
              value={matTitle}
              onChange={(e) => setMatTitle(e.target.value)}
              required
            />
            <Textarea
              label="Описание / Заметки к материалу"
              placeholder="Введите конспект, тезисы или ссылки на источники..."
              value={matDescription}
              onChange={(e) => setMatDescription(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setIsAddingMaterial(false)}>
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={!matTitle.trim()}>
                Сохранить материал
              </Button>
            </div>
          </form>
        )}

        {/* Materials List */}
        {topicMaterials.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            🌱 В этой теме пока нет материалов. Нажмите "Добавить материал", чтобы сохранить знания!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {topicMaterials.map((mat) => (
              <div
                key={mat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
                  <Checkbox
                    checked={mat.isCompleted}
                    onChange={() => toggleCompletedMaterial(mat.id)}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <Link
                      href={`/materials/${mat.id}`}
                      style={{
                        fontSize: 'var(--font-size-md)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: mat.isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                        textDecoration: mat.isCompleted ? 'line-through' : 'none',
                      }}
                    >
                      📄 {mat.title}
                    </Link>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {mat.isCompleted ? '✓ Изучено' : '⏳ В процессе'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Link href={`/materials/${mat.id}`} style={{ textDecoration: 'none' }}>
                    <Button variant="secondary" size="sm">
                      Читать ➔
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMaterial(mat.id)}
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    🗑
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Practical Tasks Section */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Typography variant="h2">🎯 Практические задачи по теме ({topicTasks.length})</Typography>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Добавить практическое задание для этой темы..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              required
            />
          </div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-md)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="P1">🔴 P1 Срочно</option>
            <option value="P2">🔵 P2 Высокий</option>
            <option value="P3">🟡 P3 Обычный</option>
            <option value="P4">⚪ P4 Низкий</option>
          </select>
          <Button type="submit" variant="primary" disabled={!newTaskTitle.trim()}>
            Добавить
          </Button>
        </form>

        {topicTasks.length === 0 ? (
          <div
            style={{
              padding: 'var(--space-6)',
              textAlign: 'center',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            🌱 В этой теме пока нет практических задач.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {topicTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Checkbox
                    checked={task.status === 'Done'}
                    onChange={() => toggleTaskStatus(task.id)}
                  />
                  <span
                    style={{
                      fontSize: 'var(--font-size-md)',
                      color: task.status === 'Done' ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
                      textDecoration: task.status === 'Done' ? 'line-through' : 'none',
                    }}
                  >
                    {task.title}
                  </span>
                </div>

                <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                  🗑
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
