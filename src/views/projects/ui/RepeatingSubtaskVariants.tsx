'use client';

import React from 'react';
import { Task } from '@/entities/task/model/types';
import { GlassmorphicTaskCard } from '@/entities/task';
import { TimelineRepeatCard } from '@/views/repeats/ui/RepeatsPage';
import { RefreshCw, Zap, CheckCircle2, Calendar, Flame, Brain, Clock, ExternalLink, ArrowRight, Layers } from 'lucide-react';

export type SubtaskVariantId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;

export const SUBTASK_VARIANTS_LIST: { id: SubtaskVariantId; name: string; desc: string }[] = [
  { id: 1, name: 'Вариант 1: Стандартный (Как простая задача)', desc: 'Обычная компактная задача с плашкой ↻ Повтор' },
  { id: 2, name: 'Вариант 2: Мини-прогресс бар', desc: 'Компактная полоса выполнения повторов 6/10' },
  { id: 3, name: 'Вариант 3: Стеклянная пилюля', desc: 'Стеклянный капсульный бейдж с иконкой 🔁 8x' },
  { id: 4, name: 'Вариант 4: Круговые стрелки', desc: 'Круглая иконка повторений с галочкой выполнения' },
  { id: 5, name: 'Вариант 5: Акцентный градиент + Серия', desc: 'Градиентная плашка с режимом и серией 🔥 5д' },
  { id: 6, name: 'Вариант 6: Точки повторений', desc: 'Ряд индикаторов-точек ● ● ● ◯ ◯' },
  { id: 7, name: 'Вариант 7: Компактный таймлайн-трек', desc: 'Однострочные шаги интервала 0 ➔ 1д ➔ 3д' },
  { id: 8, name: 'Вариант 8: Бейдж расписания', desc: 'Цветной ярлык 📅 Каждый день + счётчик' },
  { id: 9, name: 'Вариант 9: Оценка сложности AI', desc: 'Смайлик оценки сложности 🧠 Нормально 😀' },
  { id: 10, name: 'Вариант 10: Неоновый контур', desc: 'Свечение контура с акцентным фиолетовым бейджем' },
  { id: 11, name: 'Вариант 11: Кольцевой прогресс', desc: 'Мини-круговой индикатор % выполнения' },
  { id: 12, name: 'Вариант 12: Огонь серии (Streak)', desc: 'Индикатор активности с огнем 🔥 12д' },
  { id: 13, name: 'Вариант 13: Чипсы интервала', desc: 'Интервальные метки [1д] [3д] [7д]' },
  { id: 14, name: 'Вариант 14: Двойной счетчик', desc: 'Прогресс вычислений 8 из 12 повторов' },
  { id: 15, name: 'Вариант 15: Минимализм 8x', desc: 'Лаконичный капсульный бейдж 8x' },
  { id: 16, name: 'Вариант 16: Дата следующего повтора', desc: 'Бейдж ближайшей даты ⏰ 12.08' },
  { id: 17, name: 'Вариант 17: Иконка ИИ / Мозг', desc: 'Смарт-индикатор 🧠 с шагами памяти' },
  { id: 18, name: 'Вариант 18: Галочка-кольцо', desc: 'Выделенная зеленая кнопка-кольцо' },
  { id: 19, name: 'Вариант 19: Календарная лента', desc: 'Лента прошлых выполненных дат [30.07] [03.08]' },
  { id: 20, name: 'Вариант 20: Таймлайн из раздела Повторить', desc: 'Полная графическая карточка таймлайна' },
];

interface RepeatingSubtaskRendererProps {
  variantId: SubtaskVariantId;
  task: Task;
  allTasks: Task[];
  todayStr: string;
  onToggleCheckbox: () => void;
  onDelete: () => void;
  onClick: () => void;
}

export const RepeatingSubtaskRenderer: React.FC<RepeatingSubtaskRendererProps> = ({
  variantId,
  task,
  allTasks,
  todayStr,
  onToggleCheckbox,
  onDelete,
  onClick,
}) => {
  const occurrences = task.occurrences || [];
  const completedCount = occurrences.filter((o) => o.status === 'Done').length;
  const isDone = task.status === 'Done';
  const target = task.targetRepetitions || 8;
  const percent = Math.min(100, Math.round((completedCount / target) * 100));

  const modeLabels: Record<string, string> = {
    smart: '🧠 Умный повтор',
    spaced: '🧠 Интервальный',
    schedule: '📅 По расписанию',
    after_completion: '⏱ Через N дней',
  };
  const modeLabel = modeLabels[task.repetitionMode || 'spaced'] || '🔄 Повторение';

  // VARIANT 1: Standard (Plain Task Card with small ↻ Повтор badge)
  if (variantId === 1) {
    return (
      <GlassmorphicTaskCard
        task={task}
        occurrenceDate={task.scheduledDate || todayStr}
        allTasks={allTasks}
        showDragHandle={true}
        parentPathVariant={0}
        hideCategory={true}
        onToggleCheckbox={onToggleCheckbox}
        onDelete={onDelete}
        onClick={onClick}
      />
    );
  }

  // VARIANT 20: Full Timeline Card from Repeats Section
  if (variantId === 20) {
    return <TimelineRepeatCard task={task} allTasks={allTasks} onClick={onClick} />;
  }

  // VARIANT 2: Mini Progress Bar
  if (variantId === 2) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.2)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{task.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <div style={{ flex: 1, height: '5px', background: 'var(--color-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-muted)' }}>{completedCount}/{target}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 3: Glassmorphic Capsule Badge 8x
  if (variantId === 3) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(16, 185, 129, 0.25)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            🔁 {completedCount} повторов
          </span>
        </div>
      </div>
    );
  }

  // VARIANT 4: Circular Repeat Icon
  if (variantId === 4) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.2)')}>
        <div style={rowStyle}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={13} />
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
        </div>
      </div>
    );
  }

  // VARIANT 5: Accent Gradient + Streak
  if (variantId === 5) {
    return (
      <div onClick={onClick} style={{ ...cardBaseStyle('rgba(245, 158, 11, 0.3)'), background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(99, 102, 241, 0.08) 100%)' }}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{task.title}</div>
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>{modeLabel} • 🔥 {completedCount} дней серии</div>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 6: Mini Dots Row
  if (variantId === 6) {
    const dots = Array.from({ length: 5 }, (_, i) => i < completedCount);
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <div style={{ display: 'flex', gap: '3px' }}>
            {dots.map((filled, idx) => (
              <span key={idx} style={{ width: '7px', height: '7px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 7: Single-line Step Timeline Track
  if (variantId === 7) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.25)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1' }}>{completedCount} повторов</span>
          </div>
          <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '30px' }}>
            <span>0</span> <ArrowRight size={10} /> <span>1д</span> <ArrowRight size={10} /> <span>3д</span> <ArrowRight size={10} /> <span>7д</span>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 8: Period Tag
  if (variantId === 8) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(56, 189, 248, 0.25)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 7px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            📅 {modeLabel}
          </span>
        </div>
      </div>
    );
  }

  // VARIANT 9: AI Smart Rating Emoji
  if (variantId === 9) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(168, 85, 247, 0.25)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7' }}>
            🧠 Оценка: 😀 ({completedCount})
          </span>
        </div>
      </div>
    );
  }

  // VARIANT 10: Neon Outline
  if (variantId === 10) {
    return (
      <div onClick={onClick} style={{ ...cardBaseStyle('#a855f7'), boxShadow: '0 0 10px rgba(168, 85, 247, 0.25)' }}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#a855f7' }}>⚡ 🔄 Neon {completedCount}</span>
        </div>
      </div>
    );
  }

  // VARIANT 11: SVG Circle Ring
  if (variantId === 11) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <div style={{ position: 'relative', width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={26} height={26} viewBox="0 0 26 26">
              <circle cx={13} cy={13} r={10} fill="none" stroke="var(--color-border)" strokeWidth={2} />
              <circle cx={13} cy={13} r={10} fill="none" stroke="#10b981" strokeWidth={2} strokeDasharray={62.8} strokeDashoffset={62.8 - (62.8 * percent) / 100} transform="rotate(-90 13 13)" />
            </svg>
            <span style={{ position: 'absolute', fontSize: '8px', fontWeight: 800, color: 'var(--color-text-primary)' }}>{completedCount}</span>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 12: Flame Streak
  if (variantId === 12) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(239, 68, 68, 0.25)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444' }}>🔥 {completedCount}d streak</span>
        </div>
      </div>
    );
  }

  // VARIANT 13: Interval Chips
  if (variantId === 13) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          </div>
          <div style={{ display: 'flex', gap: '4px', paddingLeft: '30px' }}>
            {['1д', '3д', '7д', '14д'].map((chip, idx) => (
              <span key={idx} style={{ fontSize: '9.5px', padding: '1px 5px', borderRadius: '4px', background: idx === completedCount % 4 ? 'var(--color-accent)' : 'var(--color-surface-hover)', color: idx === completedCount % 4 ? '#ffffff' : 'var(--color-text-muted)' }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 14: Dual Line Counter
  if (variantId === 14) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.2)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{task.title}</div>
            <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>Выполнено {completedCount} из {target} повторений</div>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 15: Minimalist 8x Badge
  if (variantId === 15) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)' }}>{completedCount}x</span>
        </div>
      </div>
    );
  }

  // VARIANT 16: Next Repeat Date Badge
  if (variantId === 16) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(16, 185, 129, 0.2)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            ⏰ {task.scheduledDate ? task.scheduledDate.slice(5) : 'Сегодня'}
          </span>
        </div>
      </div>
    );
  }

  // VARIANT 17: Brain AI Icon
  if (variantId === 17) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(168, 85, 247, 0.2)')}>
        <div style={rowStyle}>
          <Brain size={16} color="#a855f7" />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
        </div>
      </div>
    );
  }

  // VARIANT 18: Ring Checkbox Button
  if (variantId === 18) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(16, 185, 129, 0.2)')}>
        <div style={rowStyle}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
            ✓
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981' }}>{completedCount} повторов</span>
        </div>
      </div>
    );
  }

  // VARIANT 19: Date Strip
  return (
    <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
        </div>
        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', paddingLeft: '30px' }}>
          📅 История: {completedCount > 0 ? `${completedCount} выполнений` : 'Нет записей'}
        </div>
      </div>
    </div>
  );
};

// Helper card styles
const cardBaseStyle = (borderColor: string): React.CSSProperties => ({
  background: 'var(--color-surface, rgba(30, 41, 59, 0.7))',
  border: `1px solid ${borderColor}`,
  borderRadius: '12px',
  padding: '10px 12px',
  cursor: 'pointer',
  boxSizing: 'border-box',
  transition: 'all 0.15s ease',
});

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
};

const CheckButton: React.FC<{ isDone: boolean; onToggle: () => void }> = ({ isDone, onToggle }) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
    style={{
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      border: isDone ? 'none' : '2px solid var(--color-accent)',
      background: isDone ? 'var(--color-accent)' : 'transparent',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
      fontSize: '12px',
    }}
  >
    {isDone && '✓'}
  </button>
);
