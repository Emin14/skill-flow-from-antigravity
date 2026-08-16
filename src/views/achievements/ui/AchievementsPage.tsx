'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, EmptyState } from '@/shared/ui';
import { Achievement, useAchievementStore } from '@/entities/achievement';
import { getCategoryColor } from '@/shared/config/categoryColors';
import { AchievementModal } from '@/features/achievement-form';
import { AchievementSectionBannerWidget } from '@/widgets/achievement-section-banner';

const MONTH_NAMES_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const AchievementsPage: React.FC = () => {
  const { achievements, fetchAchievements, deleteAchievement } = useAchievementStore();

  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchAchievements();
  }, [fetchAchievements]);

  // Group all achievements by Year and Month chronologically
  const groupedAchievements = useMemo(() => {
    const groups: { [key: string]: Achievement[] } = {};

    achievements.forEach((a) => {
      if (!a.date) return;
      const [year, month] = a.date.split('-');
      const monthIdx = parseInt(month, 10) - 1;
      const monthName = MONTH_NAMES_RU[monthIdx] || month;
      const groupKey = `${monthName} ${year}`;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(a);
    });

    return groups;
  }, [achievements]);

  if (!mounted) return null;

  const handleOpenAdd = () => {
    setEditingAchievement(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ach: Achievement) => {
    setEditingAchievement(ach);
    setIsModalOpen(true);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header Banner Widget in the exact style of ProjectSectionBannerWidget */}
      <AchievementSectionBannerWidget
        count={achievements.length}
        onAddClick={handleOpenAdd}
      />

      {/* Timeline List */}
      {achievements.length === 0 ? (
        <Card style={{ padding: '40px 20px', textAlign: 'center', borderRadius: '24px' }}>
          <EmptyState
            icon="🏆"
            title="Нет зафиксированных побед"
            description="Каждый шаг вперёд имеет значение. Зафиксируй свой первый личный рекорд!"
            actionButton={
              <Button variant="primary" onClick={handleOpenAdd}>
                <span>➕ Зафиксировать победу</span>
              </Button>
            }
          />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {Object.entries(groupedAchievements).map(([groupTitle, items]) => (
            <div key={groupTitle} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Group Header (e.g. Август 2026) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 2px 2px 2px' }}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.2px',
                  }}
                >
                  {groupTitle}
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', opacity: 0.6 }} />
              </div>

              {/* Cards in group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((ach) => {
                  const catColor = ach.category ? getCategoryColor(ach.category) || '#3b82f6' : '#10b981';
                  const formattedDate = ach.date
                    ? new Date(ach.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
                    : '';

                  return (
                    <Card
                      key={ach.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        padding: '14px 16px',
                        borderRadius: '16px',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                      }}
                    >
                      {/* Left Icon & Info */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                        {/* Icon Avatar */}
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--color-surface-hover)',
                            border: `1px solid ${catColor}40`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            flexShrink: 0,
                          }}
                        >
                          {ach.icon || '🏆'}
                        </div>

                        {/* Text Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                          <span style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                            {ach.title}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {ach.category && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: catColor,
                                  backgroundColor: `${catColor}15`,
                                  padding: '2px 7px',
                                  borderRadius: '6px',
                                }}
                              >
                                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: catColor }} />
                                {ach.category}
                              </span>
                            )}
                            <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                              {formattedDate}
                            </span>
                          </div>

                          {ach.description && (
                            <p
                              style={{
                                margin: '3px 0 0 0',
                                fontSize: '12px',
                                color: 'var(--color-text-secondary)',
                                lineHeight: '1.4',
                              }}
                            >
                              {ach.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ach)}
                          title="Редактировать"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            border: '1px solid transparent',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                            e.currentTarget.style.borderColor = 'var(--color-border)';
                            e.currentTarget.style.color = 'var(--color-text-primary)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                          }}
                        >
                          ✏️
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Удалить победу "${ach.title}"?`)) {
                              deleteAchievement(ach.id);
                            }
                          }}
                          title="Удалить"
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            backgroundColor: 'transparent',
                            border: '1px solid transparent',
                            color: 'var(--color-text-muted)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                            e.currentTarget.style.color = '#ef4444';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Achievement Creation/Edit Modal */}
      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        achievementToEdit={editingAchievement}
      />
    </div>
  );
};
