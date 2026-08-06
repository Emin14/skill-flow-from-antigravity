'use client';

import React, { useState } from 'react';
import { Task } from '@/entities/task/model/types';
import { GlassmorphicTaskCard } from '@/entities/task';
import {
  ArrowRight,
  Calendar,
  Trash2,
  RefreshCw,
  RotateCw,
  Repeat,
  History,
  Pause,
  Play,
  PauseCircle,
  Clock,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { useTaskStore } from '@/entities/task';

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
  | 27;

export const SUBTASK_VARIANTS_LIST: { id: SubtaskVariantId; name: string; desc: string }[] = [
  // Top 6 Preserved Base Variants
  { id: 1, name: '1. Стандартный (Обычная задача)', desc: 'Стандартная карточка с обычным чекбоксом' },
  { id: 2, name: '2. Мини-прогресс бар', desc: 'Компактный прогресс-бар вычислений повторов (6/10)' },
  { id: 3, name: '3. Точки повторений', desc: 'Индикаторы-точки в ряд ● ● ● ◯ ◯' },
  { id: 4, name: '4. Компактный таймлайн-трек', desc: 'Однострочные шаги интервалов 0 ➔ 1д ➔ 3д' },
  { id: 5, name: '5. Дата следующего повтора', desc: 'Ярлык ближайшей даты повтора ⏰ 12.08' },
  { id: 6, name: '6. Раскрывающийся лог истории', desc: 'Аккордеон с выпадающим списком всех прошлых дат и статусов' },

  // Preserved Base Variant 15 (with checkbox)
  { id: 7, name: '7. Точки под названием, дата справа (с чекбоксом)', desc: 'Базовый Вариант 15 с чекбоксом выполнения' },

  // 10 VARIANTS WITHOUT CHECKBOX (Orange Date Pill matching screenshot)
  { id: 8, name: '8. Без чекбокса 1: Точки под заголовком, оранжевая дата справа', desc: 'Заголовок и точки слева, оранжевая капсула даты справа' },
  { id: 9, name: '9. Без чекбокса 2: Оранжевая дата вверху, точки под датой', desc: 'Правый блок: капсула даты вверху, точки под ней' },
  { id: 10, name: '10. Без чекбокса 3: Оранжевая дата слева перед заголовком', desc: 'Капсула даты слева, заголовок в центре, точки справа' },
  { id: 11, name: '11. Без чекбокса 4: Точки слева перед заголовком, дата справа', desc: 'Точки слева, заголовок в центре, оранжевая дата справа' },
  { id: 12, name: '12. Без чекбокса 5: Строка 1 — Заголовок и дата, Строка 2 — Точки', desc: 'Двухстрочный вид: оранжевая дата в 1 строке, трек точек во 2 строке' },
  { id: 13, name: '13. Без чекбокса 6: Единая оранжевая капсула [ 📅 06.08 • ●●●◯◯ ]', desc: 'Дата и точки соединены внутри одной оранжевой капсулы' },
  { id: 14, name: '14. Без чекбокса 7: Верхний бейдж даты, под ним заголовок и точки', desc: 'Оранжевый бейдж даты над заголовком, точки справа' },
  { id: 15, name: '15. Без чекбокса 8: Нижняя полоса сегментов повтора', desc: 'Заголовок и оранжевая дата вверху, нижняя рамочная полоса точек' },
  { id: 16, name: '16. Без чекбокса 9: Левый оранжевый маркер с датой', desc: 'Вертикальный оранжевый маркер с датой слева, название и точки справа' },
  { id: 17, name: '17. Без чекбокса 10: Горизонтальный поток (Название ➔ Дата ➔ Точки)', desc: 'Единый горизонтальный поток без переносов' },

  // VARIANTS BASED ON VARIANT 18 LAYOUT PARITY (24x24 ICON IN CHECKBOX SLOT, 100% PERFECT CENTER ALIGNMENT)
  { id: 18, name: '18. Вариант 18: Динамическая иконка (🔄/⏸️/✅) + Точки после даты', desc: 'Динамическая иконка (🔄 Повтор / ⏸️ Пауза / ✅ Выполнено) + точки progress dots после даты' },
  { id: 19, name: '19. Вариант 19: Иконка Пауза (⏸️)', desc: 'Точно как Вариант 18, только с иконкой паузы Pause (24x24, аналогичное выравнивание)' },
  { id: 20, name: '20. Вариант 20: Зеленая иконка Выполнено (✅)', desc: 'Точно как Вариант 18, только с зеленой иконкой выполнения Check (24x24, аналогичное выравнивание)' },
  { id: 21, name: '21. Вариант 21: Иконка Play (▶️)', desc: 'Точно как Вариант 18 с иконкой Play (24x24)' },
  { id: 22, name: '22. Вариант 22: Иконка Repeat (🔂)', desc: 'Точно как Вариант 18 с иконкой Repeat (24x24)' },
  { id: 23, name: '23. Вариант 23: Иконка History (📜)', desc: 'Точно как Вариант 18 с иконкой History (24x24)' },
  { id: 24, name: '24. Вариант 24: Иконка PauseCircle (⏸️)', desc: 'Точно как Вариант 18 с иконкой PauseCircle (24x24)' },
  { id: 25, name: '25. Вариант 25: Иконка Clock (⏰)', desc: 'Точно как Вариант 18 с иконкой Clock (24x24)' },
  { id: 26, name: '26. Вариант 26: Иконка Sparkles (✨)', desc: 'Точно как Вариант 18 с иконкой Sparkles (24x24)' },
  { id: 27, name: '27. Вариант 27: Иконка Layers (🥞)', desc: 'Точно как Вариант 18 с иконкой Layers (24x24)' },
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
  const { updateRepeatStatus } = useTaskStore();

  const occurrences = task.occurrences || [];
  const completedCount = occurrences.filter((o) => o.status === 'Done').length;
  const isDone = task.status === 'Done' || task.repeatStatus === 'Completed';
  const target = task.targetRepetitions || 8;
  const percent = Math.min(100, Math.round((completedCount / target) * 100));

  const scheduledDisplay = task.scheduledDate ? task.scheduledDate.slice(5) : '22.06';
  const dots = Array.from({ length: 5 }, (_, i) => i < completedCount);

  // Amber Date Badge styling
  const renderAmberDatePill = () => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '3px 8px',
        borderRadius: '8px',
        background: 'rgba(245, 158, 11, 0.12)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        color: '#d97706',
        fontSize: '11px',
        fontWeight: 800,
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      <Calendar size={12} color="#d97706" />
      <span>{scheduledDisplay}</span>
    </div>
  );

  // Delete button helper
  const renderDeleteBtn = () => (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      title="Удалить подзадачу"
      style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
    >
      <Trash2 size={13} />
    </button>
  );

  // Helper for rendering Variant 1 layout with ONLY the left icon swapped (exact 100% parity with GlassmorphicTaskCard!)
  const renderVariant1WithSwappedIcon = (iconNode: React.ReactNode, onAction?: () => void, extraMetaNode?: React.ReactNode) => (
    <GlassmorphicTaskCard
      task={task}
      occurrenceDate={task.scheduledDate || todayStr}
      allTasks={allTasks}
      showDragHandle={true}
      parentPathVariant={0}
      hideCategory={true}
      hideRepeatTag={true}
      customCheckboxIcon={
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1.5px solid var(--color-border)',
            background: 'var(--color-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxSizing: 'border-box',
            padding: 0,
          }}
        >
          {iconNode}
        </button>
      }
      extraMetaNode={extraMetaNode}
      onToggleCheckbox={onToggleCheckbox}
      onDelete={onDelete}
      onClick={onClick}
    />
  );

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
            ⏰ {scheduledDisplay}
          </span>
        </div>
      </div>
    );
  }

  // VARIANT 6: Expandable History Accordion
  if (variantId === 6) {
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

  // VARIANT 7: Preserved Base Variant 15 (with Checkbox)
  if (variantId === 7) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <CheckButton isDone={isDone} onToggle={onToggleCheckbox} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {dots.map((filled, idx) => (
                <span key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
              ))}
            </div>
          </div>
          {renderAmberDatePill()}
        </div>
      </div>
    );
  }

  // VARIANTS 8 TO 17: NO CHECKBOX VARIANTS
  if (variantId === 8) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {dots.map((filled, idx) => (
                <span key={idx} style={{ width: '7px', height: '7px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderAmberDatePill()}
            {renderDeleteBtn()}
          </div>
        </div>
      </div>
    );
  }

  if (variantId === 9) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
            {renderAmberDatePill()}
            <div style={{ display: 'flex', gap: '3px' }}>
              {dots.map((filled, idx) => (
                <span key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
              ))}
            </div>
          </div>
          {renderDeleteBtn()}
        </div>
      </div>
    );
  }

  if (variantId === 10) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          {renderAmberDatePill()}
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
          <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
            {dots.map((filled, idx) => (
              <span key={idx} style={{ width: '7px', height: '7px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
            ))}
          </div>
          {renderDeleteBtn()}
        </div>
      </div>
    );
  }

  if (variantId === 11) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
            {dots.map((filled, idx) => (
              <span key={idx} style={{ width: '7px', height: '7px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
            ))}
          </div>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderAmberDatePill()}
            {renderDeleteBtn()}
          </div>
        </div>
      </div>
    );
  }

  if (variantId === 12) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={rowStyle}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
            {renderAmberDatePill()}
            {renderDeleteBtn()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {dots.map((filled, idx) => (
              <span key={idx} style={{ width: '8px', height: '8px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
            ))}
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginLeft: '4px' }}>({completedCount}/5 повторов)</span>
          </div>
        </div>
      </div>
    );
  }

  if (variantId === 13) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: '#d97706', fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
            <Calendar size={12} color="#d97706" />
            <span>{scheduledDisplay}</span>
            <span style={{ color: 'rgba(217, 119, 6, 0.4)' }}>•</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {dots.map((filled, idx) => (
                <span key={idx} style={{ width: '5px', height: '5px', borderRadius: '50%', background: filled ? '#d97706' : 'rgba(217, 119, 6, 0.3)' }} />
              ))}
            </div>
          </div>
          {renderDeleteBtn()}
        </div>
      </div>
    );
  }

  if (variantId === 14) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {renderAmberDatePill()}
            {renderDeleteBtn()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginTop: '2px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
              {dots.map((filled, idx) => (
                <span key={idx} style={{ width: '7px', height: '7px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variantId === 15) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={rowStyle}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
            {renderAmberDatePill()}
            {renderDeleteBtn()}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
            {dots.map((filled, idx) => (
              <div key={idx} style={{ height: '4px', borderRadius: '2px', background: filled ? '#10b981' : 'var(--color-border)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variantId === 16) {
    return (
      <div onClick={onClick} style={{ ...cardBaseStyle('var(--color-border)'), borderLeft: '4px solid #f59e0b' }}>
        <div style={rowStyle}>
          {renderAmberDatePill()}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              {dots.map((filled, idx) => (
                <span key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
              ))}
            </div>
          </div>
          {renderDeleteBtn()}
        </div>
      </div>
    );
  }

  if (variantId === 17) {
    return (
      <div onClick={onClick} style={cardBaseStyle('var(--color-border)')}>
        <div style={rowStyle}>
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{task.title}</span>
          {renderAmberDatePill()}
          <div style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
            {dots.map((filled, idx) => (
              <span key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: filled ? '#10b981' : 'var(--color-border)' }} />
            ))}
          </div>
          {renderDeleteBtn()}
        </div>
      </div>
    );
  }

  // =========================================================================
  // VARIANTS BASED ON VARIANT 18 LAYOUT PARITY (24x24 ICON IN CHECKBOX SLOT, 100% PERFECT CENTER ALIGNMENT)
  // =========================================================================

  // VARIANT 18: Smart Dynamic Subtask Card (Dynamic Icon + Progress Dots after Date)
  if (variantId === 18) {
    const isTaskDone = task.status === 'Done' || task.repeatStatus === 'Completed';
    const isTaskPaused = task.repeatStatus === 'Paused';

    let dynamicIcon: React.ReactNode;
    let iconBorderColor = 'var(--color-border)';
    let iconBgColor = 'var(--color-surface-hover)';

    if (isTaskDone) {
      dynamicIcon = <Check size={14} color="#10b981" strokeWidth={3} />;
      iconBorderColor = '#10b981';
      iconBgColor = 'rgba(16, 185, 129, 0.15)';
    } else if (isTaskPaused) {
      dynamicIcon = <Pause size={13} color="#f59e0b" strokeWidth={2.5} />;
      iconBorderColor = '#f59e0b';
      iconBgColor = 'rgba(245, 158, 11, 0.15)';
    } else {
      dynamicIcon = <RefreshCw size={14} color="#3b82f6" strokeWidth={2.5} />;
    }

    const progressDotsNode = (
      <div style={{ display: 'inline-flex', gap: '4px', alignItems: 'center', marginLeft: '4px' }}>
        {dots.map((filled, idx) => (
          <span
            key={idx}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: filled ? '#10b981' : 'var(--color-border)',
              display: 'inline-block',
            }}
          />
        ))}
      </div>
    );

    return (
      <GlassmorphicTaskCard
        task={task}
        occurrenceDate={task.scheduledDate || todayStr}
        allTasks={allTasks}
        showDragHandle={true}
        parentPathVariant={0}
        hideCategory={true}
        hideRepeatTag={true}
        customCheckboxIcon={
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: `1.5px solid ${iconBorderColor}`,
              background: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxSizing: 'border-box',
              padding: 0,
            }}
          >
            {dynamicIcon}
          </button>
        }
        extraMetaNode={progressDotsNode}
        onToggleCheckbox={onToggleCheckbox}
        onDelete={onDelete}
        onClick={onClick}
      />
    );
  }

  // VARIANT 19: Pause (⏸️ Bright Amber/Blue #f59e0b Pause Icon - exact same layout & 24x24 size as 18)
  if (variantId === 19) {
    const isPaused = task.repeatStatus === 'Paused';
    return renderVariant1WithSwappedIcon(
      <Pause size={13} color={isPaused ? '#ef4444' : '#f59e0b'} strokeWidth={2.5} />,
      () => updateRepeatStatus(task.id, isPaused ? 'Active' : 'Paused')
    );
  }

  // VARIANT 20: Green Check / Completed (✅ Bright Green #10b981 Icon - exact same layout & 24x24 size as 18)
  if (variantId === 20) {
    return renderVariant1WithSwappedIcon(<Check size={14} color="#10b981" strokeWidth={3} />);
  }

  // VARIANT 21: Play (▶️ Bright Green #10b981 Icon)
  if (variantId === 21) {
    return renderVariant1WithSwappedIcon(<Play size={12} color="#10b981" fill="#10b981" />);
  }

  // VARIANT 22: Repeat (🔂 Bright Indigo #818cf8 Icon)
  if (variantId === 22) {
    return renderVariant1WithSwappedIcon(<Repeat size={14} color="#818cf8" strokeWidth={2.5} />);
  }

  // VARIANT 23: History (📜 Bright Purple #a855f7 Icon)
  if (variantId === 23) {
    return renderVariant1WithSwappedIcon(<History size={14} color="#a855f7" strokeWidth={2.5} />);
  }

  // VARIANT 24: PauseCircle (⏸️ Bright Red #ef4444 Icon)
  if (variantId === 24) {
    return renderVariant1WithSwappedIcon(<PauseCircle size={15} color="#ef4444" strokeWidth={2.5} />);
  }

  // VARIANT 25: Clock (⏰ Bright Cyan #06b6d4 Icon)
  if (variantId === 25) {
    return renderVariant1WithSwappedIcon(<Clock size={14} color="#06b6d4" strokeWidth={2.5} />);
  }

  // VARIANT 26: Sparkles (✨ Bright Pink #ec4899 Icon)
  if (variantId === 26) {
    return renderVariant1WithSwappedIcon(<Sparkles size={14} color="#ec4899" strokeWidth={2.5} />);
  }

  // VARIANT 27: Layers (🥞 Bright Blue #3b82f6 Icon)
  return renderVariant1WithSwappedIcon(<Layers size={14} color="#3b82f6" strokeWidth={2.5} />);
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
      aspectRatio: '1 / 1',
      boxSizing: 'border-box',
      borderRadius: '50%',
      border: isDone ? '1.5px solid var(--color-accent)' : '1.5px solid var(--color-accent)',
      background: isDone ? 'var(--color-accent)' : 'transparent',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      flexShrink: 0,
      fontSize: '11px',
      lineHeight: 1,
    }}
  >
    {isDone && '✓'}
  </button>
);
