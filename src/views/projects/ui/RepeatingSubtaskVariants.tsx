'use client';

import React, { useState } from 'react';
import { Task } from '@/entities/task/model/types';
import { GlassmorphicTaskCard } from '@/entities/task';
import { TimelineRepeatCard } from '@/views/repeats/ui/RepeatsPage';
import { useTaskStore } from '@/entities/task';
import {
  Calendar,
  Flame,
  Brain,
  Clock,
  ArrowRight,
  Target,
  Hourglass,
  Activity,
  Terminal,
  Award,
  CheckSquare,
  Zap,
  MessageSquare,
  Play,
  Heart,
  Bookmark,
  Smile,
  FileText,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export type SubtaskVariantId =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30;

export const SUBTASK_VARIANTS_LIST: { id: SubtaskVariantId; name: string; desc: string }[] = [
  // Top 5 Preserved Variants
  { id: 1, name: '1. Стандартный (Простая задача)', desc: 'Стандартная компактная карточка с бейджем ↻ Повтор' },
  { id: 2, name: '2. Мини-прогресс бар', desc: 'Компактный прогресс-бар вычислений повторов (6/10)' },
  { id: 3, name: '3. Точки повторений', desc: 'Индикаторы-точки в ряд ● ● ● ◯ ◯' },
  { id: 4, name: '4. Компактный таймлайн-трек', desc: 'Однострочные шаги интервалов 0 ➔ 1д ➔ 3д' },
  { id: 5, name: '5. Дата следующего повтора', desc: 'Ярлык ближайшей даты повтора ⏰ 12.08' },

  // 25 Radically Different Conceptual Layouts & Widgets
  { id: 6, name: '6. Календарная сетка недели (Week Matrix Grid)', desc: 'Мини-матрица дней недели ПН-ВС с отметками выполненных дней' },
  { id: 7, name: '7. Геймификация & XP (Level & XP Bar)', desc: 'Карточка прокачки уровня Level 4 с шкалой XP и бустером x1.5' },
  { id: 8, name: '8. Компактные Канбан-колонки (Mini Kanban)', desc: '3 колонки состояния: Запланировано / В процессе / Завершено' },
  { id: 9, name: '9. Чекбокс-трекер 7 дней недели (Weekly Checkers)', desc: 'Выполняемые кликабельные чекбоксы на каждый день недели' },
  { id: 10, name: '10. Обратный отсчет & Кольцо (Countdown Clock)', desc: 'Виджет с таймером обратного отсчета времени до следующего повтора' },
  { id: 11, name: '11. Лог и отзыв последнего повтора (Last Log)', desc: 'Сплит-карточка с временем и комментом последнего выполнения' },
  { id: 12, name: '12. Консоль / Терминал (Terminal Monospace)', desc: 'Ретро-стиль консоли разработчика c логом status: active' },
  { id: 13, name: '13. Интерактивные счетчики +/- (Manual Stepper)', desc: 'Кнопки быстрых кликов [+] и [-] для ручной корректировки повторений' },
  { id: 14, name: '14. Раскрывающийся лог истории (Expandable History)', desc: 'Аккордеон с выпадающим списком всех прошлых дат и статусов' },
  { id: 15, name: '15. График памяти Эббингауза (Memory Curve AI)', desc: 'Шкала кривой забывания с % сохраняемости знаний в памяти' },
  { id: 16, name: '16. Флюидная фоновая заливка (Fluid Liquid Fill)', desc: 'Фон карточки заполняется цветом как резервуар на % прогресса' },
  { id: 17, name: '17. Прогноз завершения цикла (Completion Forecast)', desc: 'Информационный баннер с расчетной датой финиша цикла' },
  { id: 18, name: '18. Тепловая карта активности (GitHub Heatmap)', desc: 'Матрица 14 плиток активности по дням в стиле GitHub' },
  { id: 19, name: '19. Быстрая оценка сложности (Post-Task Feedback)', desc: 'Кнопки выбора сложности (Легко / Нормально / Сложно) в карточке' },
  { id: 20, name: '20. Встроенный Pomodoro-таймер (Focus Session Timer)', desc: 'Кнопка запуска 25-минутной фокус-сессии прямо в подзадаче' },
  { id: 21, name: '21. График пульса и ритма (Heartbeat Pulse Line)', desc: 'SVG волна ритмичности выполнения с % показателем регулярности' },
  { id: 22, name: '22. Карточка-папка с закладкой (Folder Tab Card)', desc: 'Дизайн папки с ярлыком категории и выступающей закладкой' },
  { id: 23, name: '23. Шкала трофеев и ачивок (Streak Milestones)', desc: 'Достижения 🏆 5д, 🥇 10д, 👑 30д с подсвеченным разблокированным' },
  { id: 24, name: '24. Суб-чеклист этапов повтора (Step Checklist)', desc: 'Вложенный чеклист шагов (Подготовка, Действие, Фиксация)' },
  { id: 25, name: '25. Футуристический Sci-Fi HUD (Visor Display)', desc: 'Кибернетический визор с угловыми рамками и сканером циклов' },
  { id: 26, name: '26. Стикер Sticky Note (Желтая заметка)', desc: 'Стиль желтой липкой бумажной заметки с булавочной иконкой' },
  { id: 27, name: '27. Суммарный хронометраж (Total Time Counter)', desc: 'Виджет учета суммарно инвестированных минут и часов' },
  { id: 28, name: '28. 24-часовая временная лента (Day Schedule Strip)', desc: 'Временная шкала дня с отметкой точного слота для задачи' },
  { id: 29, name: '29. Сплит До / После (Before / After Card)', desc: 'Сравнение стартовой даты и текущего прогресса в 2 столбца' },
  { id: 30, name: '30. Полноразмерный Таймлайн из раздела Повторить', desc: 'Полная графическая карточка таймлайна со всеми узлами' },
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
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateTaskDetails } = useTaskStore();

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

  // ==========================================
  // PRESERVED TOP 5 VARIANTS
  // ==========================================

  // VARIANT 1: Standard (Plain Task Card)
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

  // VARIANT 3: Mini Dots Row
  if (variantId === 3) {
    const dots = Array.from({ length: 5 }, (_, i) => i < completedCount);
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {dots.map((filled, idx) => (
              <span key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VARIANT 4: Single-line Step Timeline Track
  if (variantId === 4) {
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

  // VARIANT 5: Next Repeat Date Badge
  if (variantId === 5) {
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

  // ==========================================
  // 25 RADICALLY DIFFERENT CONCEPTUAL LAYOUTS
  // ==========================================

  // CONCEPT 6: Week Matrix Grid (7 Day Columns)
  if (variantId === 6) {
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.25)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#818cf8' }}>🗓 Сетка недели</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', paddingLeft: '30px' }}>
            {days.map((d, i) => {
              const isFilled = (completedCount + i) % 2 === 0;
              return (
                <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--color-text-muted)' }}>{d}</span>
                  <div style={{ width: '100%', height: '14px', borderRadius: '4px', background: isFilled ? '#10b981' : 'var(--color-surface-hover)', border: isFilled ? 'none' : '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '9px', fontWeight: 800 }}>
                    {isFilled && '✓'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 7: Level & XP Bar (Gamification)
  if (variantId === 7) {
    const currentXp = (completedCount * 120) % 1000;
    const level = Math.floor((completedCount * 120) / 1000) + 1;
    return (
      <div onClick={onClick} style={{ ...cardBaseStyle('rgba(168, 85, 247, 0.3)'), background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(99, 102, 241, 0.06) 100%)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '10px', fontWeight: 900, padding: '2px 7px', borderRadius: '8px', background: '#a855f7', color: '#ffffff' }}>
              LVL {level}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '30px' }}>
            <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'var(--color-surface-hover)', overflow: 'hidden' }}>
              <div style={{ width: `${(currentXp / 1000) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #ec4899)' }} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#a855f7' }}>{currentXp}/1000 XP (x1.5 🔥)</span>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 8: Mini Kanban Columns
  if (variantId === 8) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', paddingLeft: '30px' }}>
            <div style={{ background: 'var(--color-surface-hover)', padding: '4px 6px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '9.5px' }}>
              <div style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>📋 План</div>
              <div style={{ color: 'var(--color-text-primary)', fontWeight: 800, marginTop: '2px' }}>{target - completedCount} задач</div>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '4px 6px', borderRadius: '6px', border: '1px solid rgba(99, 102, 241, 0.3)', fontSize: '9.5px' }}>
              <div style={{ color: '#818cf8', fontWeight: 700 }}>🔄 Процесс</div>
              <div style={{ color: '#818cf8', fontWeight: 800, marginTop: '2px' }}>Активен</div>
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '4px 6px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '9.5px' }}>
              <div style={{ color: '#10b981', fontWeight: 700 }}>✅ Готово</div>
              <div style={{ color: '#10b981', fontWeight: 800, marginTop: '2px' }}>{completedCount} раз</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 9: Executable Weekly Checkbox Matrix
  if (variantId === 9) {
    const days = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(16, 185, 129, 0.3)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={rowStyle}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#10b981' }}>Чеклист недели</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
            {days.map((day, idx) => {
              const checked = idx < completedCount % 7;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCheckbox();
                  }}
                  style={{
                    flex: 1,
                    padding: '4px 0',
                    borderRadius: '6px',
                    border: checked ? 'none' : '1px solid var(--color-border)',
                    background: checked ? '#10b981' : 'var(--color-surface-hover)',
                    color: checked ? '#ffffff' : 'var(--color-text-muted)',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {day} {checked ? '✓' : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 10: Countdown Clock Widget
  if (variantId === 10) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(245, 158, 11, 0.3)')}>
        <div style={rowStyle}>
          <Clock size={16} color="#f59e0b" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{task.title}</div>
            <div style={{ fontSize: '10.5px', color: '#f59e0b', fontWeight: 700, marginTop: '2px' }}>
              ⏱ До следующего повтора: 04ч 12мин (Серия: {completedCount})
            </div>
          </div>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
        </div>
      </div>
    );
  }

  // CONCEPT 11: Last Log Entry Card
  if (variantId === 11) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.25)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#818cf8' }}>{completedCount} вып.</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', background: 'var(--color-surface-hover)', padding: '6px 10px', borderRadius: '8px', borderLeft: '3px solid #6366f1', marginLeft: '30px' }}>
            💬 <strong style={{ color: 'var(--color-text-primary)' }}>Последний повтор:</strong> Вчера в 18:30 (Оценка: Легко 😀)
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 12: Developer Monospace Terminal
  if (variantId === 12) {
    return (
      <div onClick={onClick} style={{ ...cardBaseStyle('#10b981'), background: '#090d16', border: '1px solid #10b981' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#10b981', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>$ task.exec("{task.title}")</span>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          </div>
          <div style={{ color: '#64748b' }}>
            &gt; count: <span style={{ color: '#38bdf8' }}>{completedCount}</span> | target: <span style={{ color: '#38bdf8' }}>{target}</span> | status: <span style={{ color: '#4ade80' }}>ACTIVE</span>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 13: Manual Stepper (+ / - Buttons)
  if (variantId === 13) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.3)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-surface-hover)', padding: '2px 6px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateTaskDetails(task.id, { targetRepetitions: Math.max(1, target - 1) });
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Minus size={12} />
            </button>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-accent-text)' }}>{completedCount}/{target}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateTaskDetails(task.id, { targetRepetitions: target + 1 });
              }}
              style={{ background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 14: Expandable History Accordion
  if (variantId === 14) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              style={{ background: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', borderRadius: '6px', color: 'var(--color-text-primary)', fontSize: '10px', fontWeight: 700, padding: '2px 6px', cursor: 'pointer' }}
            >
              История ({completedCount}) ▾
            </button>
          </div>
          {isExpanded && (
            <div style={{ fontSize: '10.5px', color: 'var(--color-text-secondary)', paddingLeft: '30px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
              <div>• 05.08.2026: Выполнено (Успех ✅)</div>
              <div>• 02.08.2026: Выполнено (Успех ✅)</div>
              <div>• 28.07.2026: Выполнено (Успех ✅)</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CONCEPT 15: Memory Curve AI Retention Graph
  if (variantId === 15) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(168, 85, 247, 0.3)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <Brain size={16} color="#a855f7" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#a855f7' }}>🧠 Память: 85%</span>
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', paddingLeft: '26px' }}>
            📈 Кривая Эббингауза: Оптимальное время для повторения — Сегодня
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 16: Fluid Liquid Fill Bar
  if (variantId === 16) {
    return (
      <div
        onClick={onClick}
        style={{
          ...cardBaseStyle('rgba(16, 185, 129, 0.3)'),
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${percent}%`,
            background: 'rgba(16, 185, 129, 0.12)',
            transition: 'width 0.3s ease',
            zIndex: 0,
          }}
        />
        <div style={{ ...rowStyle, position: 'relative', zIndex: 1 }}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>💧 Заполнено {percent}%</span>
        </div>
      </div>
    );
  }

  // CONCEPT 17: Completion Forecast Banner
  if (variantId === 17) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(56, 189, 248, 0.3)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          </div>
          <div style={{ fontSize: '10.5px', fontWeight: 600, color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 8px', borderRadius: '6px', marginLeft: '30px' }}>
            🏁 Прогноз финиша цикла: <strong style={{ color: 'var(--color-text-primary)' }}>24 августа</strong> (осталось {Math.max(0, target - completedCount)} повторов)
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 18: GitHub-Style Heatmap Matrix (14 Tiles)
  if (variantId === 18) {
    const tiles = Array.from({ length: 14 }, (_, i) => i);
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Heatmap</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', paddingLeft: '30px' }}>
            {tiles.map((idx) => {
              const active = idx < completedCount;
              return (
                <div
                  key={idx}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '2px',
                    background: active ? '#10b981' : 'var(--color-surface-hover)',
                    border: '1px solid var(--color-border)',
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 19: Post-Task Difficulty Feedback Selector
  if (variantId === 19) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.25)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', paddingLeft: '30px' }}>
            <button type="button" onClick={(e) => e.stopPropagation()} style={{ fontSize: '9.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}>
              🟢 Легко
            </button>
            <button type="button" onClick={(e) => e.stopPropagation()} style={{ fontSize: '9.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.15)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.3)', cursor: 'pointer' }}>
              🟡 Нормально
            </button>
            <button type="button" onClick={(e) => e.stopPropagation()} style={{ fontSize: '9.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}>
              🔴 Сложно
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 20: Integrated Focus Session / Pomodoro Button
  if (variantId === 20) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(239, 68, 68, 0.3)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alert('Фокус-сессия 25 мин запущена!');
            }}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '10.5px',
              fontWeight: 800,
              padding: '4px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)',
            }}
          >
            <Play size={10} fill="#fff" /> Старт 25м
          </button>
        </div>
      </div>
    );
  }

  // CONCEPT 21: Pulse Heartbeat Regularity Line
  if (variantId === 21) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(236, 72, 153, 0.3)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <Heart size={15} color="#ec4899" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#ec4899' }}>❤️ Ритм: 94%</span>
          </div>
          <div style={{ paddingLeft: '26px' }}>
            <svg width="100%" height="16" viewBox="0 0 200 16" fill="none">
              <path d="M0 8 L40 8 L50 2 L60 14 L70 8 L120 8 L130 0 L140 16 L150 8 L200 8" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 22: Folder Tab Styling
  if (variantId === 22) {
    return (
      <div
        onClick={onClick}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '0 12px 12px 12px',
          padding: '10px 12px',
          cursor: 'pointer',
          marginTop: '10px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            left: '0',
            background: 'var(--color-surface-hover)',
            border: '1px solid var(--color-border)',
            borderBottom: 'none',
            borderRadius: '6px 6px 0 0',
            padding: '1px 8px',
            fontSize: '9.5px',
            fontWeight: 800,
            color: 'var(--color-text-muted)',
          }}
        >
          📁 Папка повторений
        </div>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-text)' }}>{completedCount} вып.</span>
        </div>
      </div>
    );
  }

  // CONCEPT 23: Win Streak Trophy Milestones
  if (variantId === 23) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(245, 158, 11, 0.3)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <Award size={16} color="#f59e0b" />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', paddingLeft: '26px' }}>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: completedCount >= 5 ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-surface-hover)', color: completedCount >= 5 ? '#f59e0b' : 'var(--color-text-muted)' }}>
              🏆 5д {completedCount >= 5 ? '✓' : ''}
            </span>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: completedCount >= 10 ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-surface-hover)', color: completedCount >= 10 ? '#f59e0b' : 'var(--color-text-muted)' }}>
              🥇 10д {completedCount >= 10 ? '✓' : ''}
            </span>
            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: completedCount >= 30 ? 'rgba(245, 158, 11, 0.2)' : 'var(--color-surface-hover)', color: completedCount >= 30 ? '#f59e0b' : 'var(--color-text-muted)' }}>
              👑 30д {completedCount >= 30 ? '✓' : ''}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 24: Embedded Sub-steps Checklist Card
  if (variantId === 24) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-muted)' }}>Шаги повтора</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '30px', fontSize: '10.5px', color: 'var(--color-text-secondary)' }}>
            <div><span style={{ color: '#10b981' }}>✓</span> 1. Подготовка и повторение материала</div>
            <div><span style={{ color: '#10b981' }}>✓</span> 2. Выполнение практического упражнения</div>
            <div><span style={{ color: 'var(--color-text-muted)' }}>◯</span> 3. Фиксация результата в отчете</div>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 25: Sci-Fi HUD Visor Frame
  if (variantId === 25) {
    return (
      <div
        onClick={onClick}
        style={{
          background: 'rgba(15, 23, 42, 0.9)',
          border: '1px solid #38bdf8',
          borderRadius: '6px',
          padding: '10px 12px',
          cursor: 'pointer',
          position: 'relative',
          boxShadow: '0 0 12px rgba(56, 189, 248, 0.2)',
        }}
      >
        <div style={{ fontFamily: 'monospace', fontSize: '10px', color: '#38bdf8', letterSpacing: '1px', marginBottom: '4px' }}>
          [HUD // SYSTEM REPEAT SCANNER]
        </div>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#f8fafc', flex: 1 }}>{task.title}</span>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace' }}>
            CYCLES: 0{completedCount}/0{target}
          </span>
        </div>
      </div>
    );
  }

  // CONCEPT 26: Yellow Sticky Note Style
  if (variantId === 26) {
    return (
      <div
        onClick={onClick}
        style={{
          background: 'linear-gradient(135deg, #fef08a 0%, #fef3c7 100%)',
          border: '1px solid #fde047',
          borderRadius: '4px',
          padding: '10px 12px',
          color: '#713f12',
          cursor: 'pointer',
          boxShadow: '2px 4px 10px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#a16207' }}>📌 Заметка-повторение</span>
          <span style={{ fontSize: '10px', fontWeight: 800 }}>{completedCount} повторов</span>
        </div>
        <div style={rowStyle}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCheckbox();
            }}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              border: '2px solid #854d0e',
              background: isDone ? '#854d0e' : 'transparent',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
            }}
          >
            {isDone && '✓'}
          </button>
          <span style={{ fontSize: '13.5px', fontWeight: 700, textDecoration: isDone ? 'line-through' : 'none' }}>{task.title}</span>
        </div>
      </div>
    );
  }

  // CONCEPT 27: Invested Time Chronometer Widget
  if (variantId === 27) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(16, 185, 129, 0.3)')}>
        <div style={rowStyle}>
          <Clock size={16} color="#10b981" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{task.title}</div>
            <div style={{ fontSize: '10.5px', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
              ⏱ Время в работе: {completedCount * 20} минут ({completedCount} повторов)
            </div>
          </div>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
        </div>
      </div>
    );
  }

  // CONCEPT 28: 24-Hour Day Schedule Ruler
  if (variantId === 28) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--color-text-muted)' }}>09:00 - 09:30</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', paddingLeft: '30px', fontSize: '9px', color: 'var(--color-text-muted)' }}>
            <span>08:00</span>
            <div style={{ flex: 1, height: '4px', background: 'linear-gradient(90deg, var(--color-border) 20%, #10b981 40%, var(--color-border) 60%)', borderRadius: '2px' }} />
            <span>22:00</span>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 29: Split Comparative Before / After Card
  if (variantId === 29) {
    return (
      <div onClick={onClick} style={cardBaseStyle('rgba(99, 102, 241, 0.3)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>{task.title}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '30px' }}>
            <div style={{ background: 'var(--color-surface-hover)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Старт:</span> <strong style={{ color: 'var(--color-text-primary)' }}>{task.createdAt ? task.createdAt.slice(5, 10) : '01.08'}</strong>
            </div>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '4px 8px', borderRadius: '6px', fontSize: '10px' }}>
              <span style={{ color: '#818cf8' }}>Прогресс:</span> <strong style={{ color: '#818cf8' }}>{completedCount} вып.</strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CONCEPT 30: Full Timeline Card from Repeats Section
  return <TimelineRepeatCard task={task} allTasks={allTasks} onClick={onClick} />;
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
