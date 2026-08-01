'use client';

import React, { useState, useEffect } from 'react';
import { InboxItem } from '@/entities/inbox';
import { useGoalStore } from '@/entities/goal';
import { useTopicStore } from '@/entities/topic';
import { triageService } from '../model/triageService';
import { Typography, Input, Button } from '@/shared/ui';
import { lockBodyScroll, unlockBodyScroll } from '@/shared/lib/scrollLock';
import styles from './TriageModal.module.css';

interface TriageModalProps {
  item: InboxItem;
  onClose: () => void;
}

type EntityTarget = 'Task' | 'Topic' | 'Goal' | 'Material';

export const TriageModal: React.FC<TriageModalProps> = ({ item, onClose }) => {
  const { goals, fetchGoals } = useGoalStore();
  const { topics, fetchTopics } = useTopicStore();

  const [targetType, setTargetType] = useState<EntityTarget>('Task');
  const [title, setTitle] = useState(item.text);
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    lockBodyScroll();
    fetchGoals();
    fetchTopics();
    return () => {
      unlockBodyScroll();
    };
  }, [fetchGoals, fetchTopics]);

  useEffect(() => {
    if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[0].id);
    }
  }, [goals, selectedGoalId]);

  useEffect(() => {
    const filteredTopics = topics.filter((t) => !selectedGoalId || t.goalId === selectedGoalId);
    if (filteredTopics.length > 0) {
      setSelectedTopicId(filteredTopics[0].id);
    } else {
      setSelectedTopicId('');
    }
  }, [topics, selectedGoalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (targetType === 'Task') {
        await triageService.convertToTask(item.id, {
          title: title.trim(),
          topicId: selectedTopicId || null,
          goalId: selectedGoalId || null,
        });
      } else if (targetType === 'Topic') {
        if (!selectedGoalId) return;
        await triageService.convertToTopic(item.id, {
          title: title.trim(),
          goalId: selectedGoalId,
        });
      } else if (targetType === 'Goal') {
        await triageService.convertToGoal(item.id, {
          title: title.trim(),
        });
      } else if (targetType === 'Material') {
        if (!selectedTopicId) return;
        await triageService.convertToMaterial(item.id, {
          title: title.trim(),
          topicId: selectedTopicId,
          type: 'Note',
        });
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Typography variant="h2">✔ Разбор записи (Triage)</Typography>
        <Typography variant="caption" style={{ color: 'var(--color-text-muted)' }}>
          Выберите, во что преобразить данную мысль
        </Typography>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Target Entity Selector */}
          <div className={styles.entitySelector}>
            {(['Task', 'Topic', 'Goal', 'Material'] as EntityTarget[]).map((type) => (
              <button
                key={type}
                type="button"
                className={`${styles.entityOption} ${targetType === type ? styles.entityOptionSelected : ''}`}
                onClick={() => setTargetType(type)}
              >
                <span style={{ fontSize: '18px' }}>
                  {type === 'Task' ? '🎯' : type === 'Topic' ? '🐘' : type === 'Goal' ? '🏆' : '📄'}
                </span>
                <span>{type === 'Task' ? 'Задача' : type === 'Topic' ? 'Тема' : type === 'Goal' ? 'Цель' : 'Материал'}</span>
              </button>
            ))}
          </div>

          <Input
            label="Название элемента"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Goal Link Select */}
          {(targetType === 'Topic' || targetType === 'Task') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Привязать к цели:
              </label>
              <select
                className={styles.selectInput}
                value={selectedGoalId}
                onChange={(e) => setSelectedGoalId(e.target.value)}
              >
                <option value="">-- Без цели --</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Topic Link Select */}
          {(targetType === 'Task' || targetType === 'Material') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <label style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                Привязать к теме:
              </label>
              <select
                className={styles.selectInput}
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
              >
                <option value="">-- Без темы --</option>
                {topics
                  .filter((t) => !selectedGoalId || t.goalId === selectedGoalId)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" variant="primary" disabled={!title.trim() || isSubmitting}>
              Преобразовать
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
