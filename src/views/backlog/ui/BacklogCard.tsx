'use client';

import React from 'react';
import { BacklogItem } from '@/entities/backlog/model/types';
import { ExternalLink, ArrowRight, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import styles from './BacklogCard.module.css';

interface BacklogCardProps {
  item: BacklogItem;
  onClick: () => void;
  onConvertToTask: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const formatExternalUrl = (url?: string | null): string | null => {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const BacklogCard: React.FC<BacklogCardProps> = ({
  item,
  onClick,
  onConvertToTask,
  onDelete,
}) => {
  const isDone = item.status === 'done';
  const formattedLink = formatExternalUrl(item.link);

  const statusLabel = (() => {
    switch (item.status) {
      case 'idea':
        return { text: '💡 Мысль', className: styles.statusIdea };
      case 'backlog':
        return { text: '📋 В бэклоге', className: styles.statusBacklog };
      case 'planned':
        return { text: '🚀 В планах', className: styles.statusPlanned };
      case 'done':
        return { text: '✅ Сделано', className: styles.statusDone };
      default:
        return { text: item.status, className: styles.statusIdea };
    }
  })();

  const priorityLabel = (() => {
    switch (item.priority) {
      case 'high':
        return { text: '🔥 Высокий', className: styles.priorityHigh };
      case 'medium':
        return { text: '⚡ Средний', className: styles.priorityMedium };
      case 'low':
        return { text: '☕ Низкий', className: styles.priorityLow };
      default:
        return null;
    }
  })();

  return (
    <div
      className={`${styles.card} ${isDone ? styles.cardDone : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Top Header Row: Topic & Status */}
      <div className={styles.headerRow}>
        <span className={styles.topicBadge} title={`Тема: ${item.topic}`}>
          📁 {item.topic}
        </span>
        <span className={`${styles.statusBadge} ${statusLabel.className}`}>
          {statusLabel.text}
        </span>
      </div>

      {/* Title */}
      <h4 className={`${styles.title} ${isDone ? styles.titleDone : ''}`}>
        {item.title}
      </h4>

      {/* Description Snippet */}
      {item.description && (
        <p className={styles.descriptionSnippet}>
          {item.description}
        </p>
      )}

      {/* Tags Row */}
      {item.tags && item.tags.length > 0 && (
        <div className={styles.tagsRow}>
          {item.tags.map((tag) => (
            <span key={tag} className={styles.tagPill}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer Row: Priority, Link, Actions */}
      <div className={styles.footerRow}>
        <div className={styles.metaLeft}>
          {priorityLabel && (
            <span className={`${styles.priorityBadge} ${priorityLabel.className}`}>
              {priorityLabel.text}
            </span>
          )}
          {formattedLink && (
            <a
              href={formattedLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.linkAnchor}
              title={`Открыть ссылку: ${formattedLink}`}
            >
              <ExternalLink size={12} />
              <span>Ссылка</span>
            </a>
          )}
        </div>

        <div className={styles.actionsRight}>
          {!isDone && (
            <button
              type="button"
              className={`${styles.actionBtn} ${styles.convertBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                onConvertToTask(e);
              }}
              title="Создать задачу в трекере на сегодня"
            >
              <span>В задачу</span>
              <ArrowRight size={12} />
            </button>
          )}

          <button
            type="button"
            className={`${styles.iconBtn} ${styles.deleteIconBtn}`}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            title="Удалить идею"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
