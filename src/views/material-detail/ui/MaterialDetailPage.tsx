'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, Typography, Button, Input, Textarea } from '@/shared/ui';
import { useMaterialStore } from '@/entities/material';
import { useTopicStore } from '@/entities/topic';
import { useRepeatCardStore } from '@/entities/repeat-card';
import styles from './MaterialDetailPage.module.css';

interface MaterialDetailPageProps {
  materialId: string;
}

export const MaterialDetailPage: React.FC<MaterialDetailPageProps> = ({ materialId }) => {
  const router = useRouter();
  const { materials, fetchMaterials, toggleCompletedMaterial, updateMaterial, deleteMaterial } = useMaterialStore();
  const { topics, fetchTopics } = useTopicStore();
  const { cards, fetchCards, addCard, deleteCard } = useRepeatCardStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // New Card form state
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');

  useEffect(() => {
    fetchMaterials();
    fetchTopics();
    fetchCards();
  }, [fetchMaterials, fetchTopics, fetchCards]);

  const material = materials.find((m) => m.id === materialId);
  const parentTopic = material ? topics.find((t) => t.id === material.topicId) : null;
  const materialCards = cards.filter((c) => c.materialId === materialId);

  useEffect(() => {
    if (material) {
      setEditTitle(material.title);
      setEditDescription(material.description || material.content || '');
    }
  }, [material]);

  if (!material) {
    return (
      <div className={styles.container}>
        <Card style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Typography variant="h2" style={{ marginBottom: 'var(--space-3)' }}>
            Материал не найден
          </Typography>
          <Link href="/goals" style={{ textDecoration: 'none' }}>
            <Button variant="primary">← Вернуться к списку целей</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    await updateMaterial(material.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      content: editDescription.trim(),
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Вы уверены, что хотите удалить этот материал?')) {
      await deleteMaterial(material.id);
      if (parentTopic) {
        router.push(`/topics/${parentTopic.id}`);
      } else {
        router.push('/goals');
      }
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFront.trim() || !cardBack.trim()) return;

    await addCard(material.id, cardFront.trim(), cardBack.trim());
    setCardFront('');
    setCardBack('');
    setIsAddingCard(false);
  };

  return (
    <div className={styles.container}>
      {/* Back Link */}
      <div>
        <Link href={parentTopic ? `/topics/${parentTopic.id}` : '/goals'} style={{ textDecoration: 'none' }}>
          <Typography variant="caption" style={{ color: 'var(--color-accent)', cursor: 'pointer' }}>
            ← Назад к теме: {parentTopic ? parentTopic.title : 'Тема'}
          </Typography>
        </Link>
      </div>

      {isEditing ? (
        /* Edit Form */
        <Card>
          <Typography variant="h2" style={{ marginBottom: 'var(--space-4)' }}>
            ✎ Редактирование материала
          </Typography>
          <form onSubmit={handleSaveEdit} className={styles.editForm}>
            <Input
              label="Название материала"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
            <Textarea
              label="Описание / Текст материала"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Отмена
              </Button>
              <Button type="submit" variant="primary" disabled={!editTitle.trim()}>
                Сохранить изменения
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        /* View Mode */
        <>
          <Card className={styles.headerCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
              <div>
                <Typography variant="h1">📄 {material.title}</Typography>
                <div className={styles.metaRow} style={{ marginTop: '8px' }}>
                  <span>
                    📅 Добавлено{' '}
                    {new Date(material.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  ✎ Изменить
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDelete} style={{ color: 'var(--color-text-muted)' }}>
                  🗑 Удалить
                </Button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <Button
                variant={material.isCompleted ? 'secondary' : 'primary'}
                onClick={() => toggleCompletedMaterial(material.id)}
                style={{
                  backgroundColor: material.isCompleted ? 'var(--color-success-light)' : undefined,
                  borderColor: material.isCompleted ? 'var(--color-success)' : undefined,
                  color: material.isCompleted ? 'var(--color-success)' : undefined,
                }}
              >
                {material.isCompleted ? '✓ Изучено' : 'Отметить как изученное'}
              </Button>
              {material.completedAt && (
                <Typography variant="caption" style={{ color: 'var(--color-success)' }}>
                  Завершено {new Date(material.completedAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Typography>
              )}
            </div>
          </Card>

          {/* Material Content Card */}
          <Card className={styles.contentCard}>
            {material.description || material.content || (
              <span style={{ color: 'var(--color-text-muted)' }}>Описание материала отсутствует.</span>
            )}
          </Card>

          {/* Repeat Cards Section */}
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h2">🧠 Карточки для повторения ({materialCards.length})</Typography>
              <Button variant="primary" onClick={() => setIsAddingCard(!isAddingCard)}>
                {isAddingCard ? 'Отмена' : '➕ Добавить карточку'}
              </Button>
            </div>

            {/* Form to create RepeatCard */}
            {isAddingCard && (
              <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <Input
                  label="Передняя сторона (Вопрос)"
                  placeholder="Например: Что такое B-Tree индекс в Postgres?"
                  value={cardFront}
                  onChange={(e) => setCardFront(e.target.value)}
                  required
                />
                <Textarea
                  label="Задняя сторона (Ответ)"
                  placeholder="Введите краткий и понятный ответ..."
                  value={cardBack}
                  onChange={(e) => setCardBack(e.target.value)}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                  <Button type="button" variant="secondary" onClick={() => setIsAddingCard(false)}>
                    Отмена
                  </Button>
                  <Button type="submit" variant="primary" disabled={!cardFront.trim() || !cardBack.trim()}>
                    Создать карточку
                  </Button>
                </div>
              </form>
            )}

            {/* List of Cards */}
            {materialCards.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-6)',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                🌱 К этому материалу еще не созданы карточки повторения.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {materialCards.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-2)',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                        ❓ {card.front}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCard(card.id)}
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        🗑
                      </Button>
                    </div>

                    <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      💡 {card.back}
                    </div>

                    <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      <span>🗓 Следующее повторение: {card.nextReviewDate || 'Сегодня'}</span>
                      <span>🔄 Повторено: {card.repetitions} раз</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
