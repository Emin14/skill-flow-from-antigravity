# Design System — Skill Flow

> Версия: 1.0 · Дата: 2026-08-04  
> Статус: **Проект (на согласование)**

---

## Оглавление

1. [Цветовая философия](#цветовая-философия)
2. [Принципы минимализма токенов](#принципы-минимализма-токенов)
3. [Семантические токены](#семантические-токены)
4. [Правила использования акцентного цвета](#правила-использования-акцентного-цвета)
5. [Карта компонентов](#карта-компонентов)
6. [Динамические токены (JS-managed)](#динамические-токены)
7. [Запрещённые паттерны](#запрещённые-паттерны)
8. [Рекомендации к улучшению (отдельный список)](#рекомендации-к-улучшению)

---

## Цветовая философия

### Принципы

**1. Интерфейс нейтрален. Акцент — сигнал.**  
Большие поверхности (страницы, карточки, панели) остаются нейтральными — серый, белый, тёмно-серый. Насыщенный акцентный цвет привлекает внимание только к тому, что требует действия пользователя.

**2. Акцент обозначает действие, а не украшает.**  
FAB, активный чекбокс, прогресс-бар, активная вкладка, кольцо фокуса — это правильные места для акцента. Фон карточки, заголовок страницы, большой баннер — нет.

**3. Контраст — обязательное требование, не опция.**  
Все сочетания текст/фон должны удовлетворять WCAG 2.1 AA (≥ 4.5:1 для текста, ≥ 3.0:1 для крупных элементов). Система токенов автоматически обеспечивает это — без ручных проверок для каждого нового акцентного цвета.

**4. Один токен — одна ответственность.**  
Каждый CSS-токен решает ровно одну задачу. Не существует "универсальных" токенов.

**5. Все цвета через токены. Никаких hex в компонентах.**  
Hex-коды, rgba(), hsl() — только в `colors.css`. В компонентах — исключительно `var(--token-name)`.

**6. Тема влияет на фундамент. Акцент влияет на акценты.**  
Тема (light/dark) определяет цвет поверхностей, текста, границ. Акцентный цвет — только точечные интерактивные элементы. Они независимы.

---

## Принципы минимализма токенов

Токен вводится только если:

- Нет существующего токена с той же семантикой
- Элемент встречается в 3+ компонентах
- Без токена невозможно обеспечить правильное поведение при смене темы/акцента

Если можно использовать существующий токен — используем его. Итоговый набор: **23 статических токена** + динамические (управляются JS).

---

## Семантические токены

### Поверхности

| Токен | Назначение | Где использовать | Где запрещено |
|-------|-----------|-----------------|---------------|
| `--color-bg` | Холст приложения. Самый нижний слой. | `body`, оболочки страниц | Карточки, модальные окна |
| `--color-surface` | Основная поверхность карточек и контента | Карточки задач, карточки проектов, секции, боковые панели | Модальные окна, всплывающие меню |
| `--color-surface-elevated` | Приподнятая поверхность. Выше `surface`. | Модальные окна, Bottom Sheet, выпадающие списки, тултипы, поповеры | Карточки задач, базовые секции |
| `--color-surface-hover` | Наложение при ховере на интерактивную поверхность | `:hover` для строк, кнопок-призраков, элементов списка | Как фон статичных элементов |
| `--color-surface-active` | Наложение при нажатии/активации | `:active` для кнопок, нажатых чипов | Как фон статичных элементов |

**Значения:**

```css
/* Dark mode (default) */
--color-bg:               #0f172a;
--color-surface:          #1e293b;
--color-surface-elevated: #283548;
--color-surface-hover:    rgba(255, 255, 255, 0.06);
--color-surface-active:   rgba(255, 255, 255, 0.12);

/* Light mode */
--color-bg:               #f8fafc;
--color-surface:          #ffffff;
--color-surface-elevated: #f1f5f9;
--color-surface-hover:    rgba(0, 0, 0, 0.04);
--color-surface-active:   rgba(0, 0, 0, 0.08);
```

---

### Границы

| Токен | Назначение | Где использовать | Где запрещено |
|-------|-----------|-----------------|---------------|
| `--color-border` | Стандартная нейтральная граница | Карточки, инпуты, разделители | Как акцентный бордер |
| `--color-border-hover` | Граница при ховере/фокусе | `:hover`, `:focus` для инпутов и карточек | Статичные границы |

**Значения:**

```css
/* Dark mode */
--color-border:       rgba(255, 255, 255, 0.10);
--color-border-hover: rgba(255, 255, 255, 0.20);

/* Light mode */
--color-border:       rgba(0, 0, 0, 0.10);
--color-border-hover: rgba(0, 0, 0, 0.20);
```

> **Примечание:** Акцентная граница обеспечивается через `--color-accent-border` (см. ниже).

---

### Типографика

| Токен | Назначение | Где использовать | Где запрещено |
|-------|-----------|-----------------|---------------|
| `--color-text-primary` | Основной текст. Максимальный контраст. | Заголовки, названия задач, основной контент | Мелкие вспомогательные подписи |
| `--color-text-secondary` | Вторичный текст. Чуть тише основного. | Подзаголовки, метки секций | Placeholder в инпутах |
| `--color-text-muted` | Приглушённый текст. Вспомогательный. | Placeholder, метаинформация, дата, категория, временны́е метки | Основной текст карточек |
| `--color-text-disabled` | Отключённые элементы. Не интерактивен. | `disabled` кнопки, заблокированные инпуты | Как decorative muted text |

**Значения:**

```css
/* Dark mode (contrast ratios vs #1e293b surface) */
--color-text-primary:   #f8fafc;   /* 14.8:1 */
--color-text-secondary: #cbd5e1;   /* 9.5:1  */
--color-text-muted:     #94a3b8;   /* 6.2:1  */
--color-text-disabled:  #64748b;   /* 4.1:1  */

/* Light mode (contrast ratios vs #ffffff surface) */
--color-text-primary:   #0f172a;   /* 18.1:1 */
--color-text-secondary: #334155;   /* 10.6:1 */
--color-text-muted:     #64748b;   /* 5.9:1  */
--color-text-disabled:  #94a3b8;   /* 3.7:1  */
```

---

### Акцентная система

| Токен | Назначение | Где использовать | Где запрещено |
|-------|-----------|-----------------|---------------|
| `--color-accent` | Основной акцентный цвет. Сигнал действия. | FAB, filled кнопка «primary», заливка чекбокса, progress fill, active tab indicator, selected dot/ring | Фон страницы, заголовки, большие карточки, баннеры |
| `--color-accent-hover` | Более тёмный оттенок для hover-состояния | `:hover` primary кнопки, `:hover` filled чипа | |
| `--color-accent-light` | Мягкий прозрачный фон с акцентным оттенком | Фон активного chip/badge, soft highlight для selected item, тонкий фон progress track, мягкая подсветка активного раздела | Основные карточки, большие секции |
| `--color-accent-border` | Акцентная граница/кольцо | Граница focused input, кольцо выбранного элемента, border активного chip | Основные нейтральные границы |
| `--color-accent-text` | **Читаемый** акцентный текст на нейтральной поверхности | Ссылки, имена категорий/тегов, текстовые акцентные лейблы на белых/тёмных карточках | Текст поверх акцентного заполнения (там `--color-accent-on-accent`) |

**Вычисляются динамически в `colorUtils.ts` (без if-кондиций):**

```css
/* Вычисляются из hex пользователя: */
--color-accent:        [hex пользователя]
--color-accent-hover:  [hex, saturated -10%, lightness -8%]
--color-accent-light:  rgba(r, g, b, 0.13)
--color-accent-border: rgba(r, g, b, 0.30)
--color-accent-text:   [в dark: hsl(hue, 85%, 65%) / в light: hsl(hue, 75%, 32%)]
```

> **`--color-accent-text` — главная формула без if:**  
> В dark-режиме яркость подтягивается вверх до ≥62%, в light-режиме — вниз до ≤35%. Это гарантирует WCAG AA для любого пользовательского hex без единого условия `if`.

---

### Семантические цвета состояний

| Токен | Назначение | Где использовать |
|-------|-----------|-----------------|
| `--color-success` | Успех, завершение | Заполнение чекбокса, флаг «завершено», полоска «все подзадачи выполнены» |
| `--color-success-light` | Мягкий фон успеха | Фон banner «все задачи выполнены», highlight выполненной группы |
| `--color-warning` | Предупреждение, просрочено скоро | Бейдж даты «сегодня», предупреждение о просрочке |
| `--color-warning-light` | Мягкий фон предупреждения | Фон warning-бейджа |
| `--color-danger` | Ошибка, деструктивное действие | Кнопка «Удалить», swipe-to-delete, badge «Просрочено», border validation error |
| `--color-danger-hover` | Hover на danger-элементах | `:hover` danger-кнопки |
| `--color-danger-light` | Мягкий фон ошибки | Фон error-бейджа, мягкая подсветка просроченной задачи |

**Значения:**

```css
/* Dark mode */
--color-success:       #10b981;
--color-success-light: rgba(16, 185, 129, 0.13);
--color-warning:       #f59e0b;
--color-warning-light: rgba(245, 158, 11, 0.13);
--color-danger:        #ef4444;
--color-danger-hover:  #dc2626;
--color-danger-light:  rgba(239, 68, 68, 0.13);

/* Light mode */
--color-success:       #059669;
--color-success-light: rgba(5, 150, 105, 0.10);
--color-warning:       #d97706;
--color-warning-light: rgba(217, 119, 6, 0.10);
--color-danger:        #dc2626;
--color-danger-hover:  #b91c1c;
--color-danger-light:  rgba(220, 38, 38, 0.10);
```

---

### Итоговый список всех статических токенов (23)

```
Поверхности (5):
  --color-bg
  --color-surface
  --color-surface-elevated     ← НОВЫЙ (не было в colors.css)
  --color-surface-hover
  --color-surface-active

Границы (2):
  --color-border
  --color-border-hover

Типографика (4):
  --color-text-primary
  --color-text-secondary
  --color-text-muted
  --color-text-disabled

Акцент (5):
  --color-accent
  --color-accent-hover
  --color-accent-light
  --color-accent-border        ← НОВЫЙ (не было в colors.css, вычисляется)
  --color-accent-text          ← НОВЫЙ (не было в colors.css, вычисляется)

Состояния (7):
  --color-success
  --color-success-light
  --color-warning
  --color-warning-light
  --color-danger
  --color-danger-hover
  --color-danger-light
```

**Удаляется:** `--color-accent-light-bg` (дублирует `--color-accent-light`)

---

## Правила использования акцентного цвета

### ✅ Можно использовать `--color-accent`

| Элемент | Как применяется |
|---------|----------------|
| FAB (кнопка `+`) | `background-color: --color-accent` |
| Primary кнопка | `background-color: --color-accent` |
| Активный чекбокс | `background-color: --color-accent` (вместо текущего `--color-success`) |
| Прогресс-бар (fill) | `background-color: --color-accent` |
| Активная вкладка (indicator) | `background-color: --color-accent` (тонкая полоска/dot) |
| Focus ring | `outline-color: --color-accent` |
| Toggle/Switch (active) | `background-color: --color-accent` |
| Ссылки | `color: --color-accent-text` |
| Активный item в боковом меню | `color: --color-accent-text`, `background: --color-accent-light` |
| Маленький бейдж-индикатор | `background-color: --color-accent`, `color: white` |
| Граница focused инпута | `border-color: --color-accent-border` |

### ✅ Можно использовать `--color-accent-light` (мягкий фон)

| Элемент | Как применяется |
|---------|----------------|
| Мягкий фон активного chip | `background: --color-accent-light` |
| Мягкая подсветка выбранного раздела | `background: --color-accent-light` |
| Фон активной таб-панели | `background: --color-accent-light` |

### ✅ Можно использовать `--color-accent-text` (читаемый текст)

| Элемент | Как применяется |
|---------|----------------|
| Текст ссылок | `color: --color-accent-text` |
| Текст категорий/тегов (вместо `--category-text-color`) | `color: --color-accent-text` |
| Акцентные лейблы на нейтральных фонах | `color: --color-accent-text` |

### ❌ Нельзя использовать акцент

| Запрещено | Почему |
|-----------|--------|
| Фон большой карточки задачи | Ломает визуальную иерархию |
| Фон страницы/секции | Перегружает интерфейс |
| Большой баннер (> 20% экрана сплошным цветом) | Конкурирует с основным контентом |
| Фон модального окна | Отвлекает от содержимого |
| Текст заголовков H1/H2 | Акцент должен выделять действия, не информацию |
| Декоративные иконки без интерактивности | Создаёт ложные affordances |

---

## Карта компонентов

### Базовые UI-примитивы

| Компонент | Используемые токены | Запрещённые токены |
|-----------|--------------------|--------------------|
| **Card** | `--color-surface`, `--color-border`, `--color-text-primary`, `--shadow-sm` | `--color-accent` как bg |
| **Button (primary)** | `--color-accent`, `--color-accent-hover`, `white` (on-accent) | `--color-surface` |
| **Button (secondary)** | `--color-surface`, `--color-border`, `--color-text-secondary`, `--color-surface-hover` | `--color-accent` как bg |
| **Button (ghost)** | `--color-surface-hover`, `--color-text-primary` | `--color-accent` как bg |
| **Button (danger)** | `--color-danger`, `--color-danger-hover`, `white` | |
| **Checkbox** | `--color-accent` (fill checked), `--color-border` (ring unchecked), `white` (checkmark) | `--color-success` как fill |
| **Input / Textarea** | `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-muted` (placeholder), `--color-accent-border` (focus) | Любой hardcoded цвет |
| **Progress** | `--color-border` (track bg), `--color-accent` (fill) | Hardcoded rgba |
| **Badge / Chip** | `--color-accent-light` (bg), `--color-accent-text` (text), `--color-accent-border` (border) | Hardcoded цвета |
| **Toast (success)** | `--color-success`, `--color-success-light` | |
| **Toast (error)** | `--color-danger`, `--color-danger-light` | |
| **Skeleton** | `--color-surface-hover` | |
| **Divider** | `--color-border` | |
| **Typography** | `--color-text-primary`, `--color-text-secondary`, `--color-text-muted` | Hardcoded цвета |

### Виджеты

| Компонент | Используемые токены |
|-----------|---------------------|
| **TopBar** | `--color-bg`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-surface-hover` |
| **HabitProgressBanner** | `--color-surface`, `--color-border`, `--color-accent`, `--color-accent-light`, `--color-text-primary`, `--color-text-muted` + `--widget-*` (опциональный override) |
| **HabitProgressHeaderWidget** | `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-surface-hover`, `--color-accent-text` |
| **InboxHeaderWidget** | `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-surface-hover` |
| **OverdueHeaderWidget** | `--color-surface`, `--color-border`, `--color-text-primary`, `--color-danger`, `--color-danger-light` |
| **ProjectFilterTabsWidget** | `--color-surface`, `--color-border`, `--color-text-muted`, `--color-accent` (active tab), `--color-accent-light`, `--color-accent-text` |

### Карточки

| Компонент | Используемые токены |
|-----------|---------------------|
| **GlassmorphicTaskCard** | `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-accent-text` (category/repeat tags), `--color-danger` (swipe delete), `--color-warning` (today badge), `--color-danger-light` (overdue badge) |
| **GoalCard** | `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-accent`, `--color-success` |

### Страницы и разделы

| Страница | Ключевые токены |
|----------|----------------|
| **TodayPage** | `--color-bg`, `--color-surface`, `--color-border` |
| **CalendarPage** | `--color-surface`, `--color-border`, `--color-accent` (selected day), `--color-success` (has-tasks dot), `--color-text-primary`, `--color-text-muted` |
| **RepeatsPage** | `--color-surface`, `--color-border`, `--color-accent`, `--color-accent-light`, `--color-success` (active node), `--color-danger` (overdue node), `--color-text-primary`, `--color-text-muted` |
| **InboxPage** | `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-muted` |
| **ProjectsPage** | `--color-surface`, `--color-border`, `--color-accent`, `--color-text-primary` |
| **StatisticsPage** | `--color-surface`, `--color-border`, `--color-accent`, `--color-accent-light`, `--color-text-primary`, `--color-text-muted` |
| **GoalsPage** | `--color-surface`, `--color-border`, `--color-accent`, `--color-success`, `--color-text-primary` |
| **SettingsPage** | `--color-surface`, `--color-surface-elevated` (select dropdowns), `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-accent` |

### Модальные окна

| Компонент | Ключевые токены |
|-----------|----------------|
| **EditTaskModal** | `--color-surface-elevated`, `--color-border`, `--color-text-primary`, `--color-accent`, `--color-accent-border` |
| **QuickCreateModal** | `--color-surface-elevated`, `--color-border`, `--color-text-primary`, `--color-accent` |
| **RepeatingTaskDetailModal** | `--color-surface-elevated`, `--color-border`, `--color-text-primary`, `--color-accent`, `--color-success` |
| **SmartRatingModal** | `--color-surface-elevated`, `--color-border`, `--color-text-primary`, `--color-accent` |
| **TriageModal** | `--color-surface-elevated`, `--color-border`, `--color-text-primary` |

---

## Динамические токены

Управляются JavaScript, устанавливаются через `element.style.setProperty()`. Не определяются в статическом CSS.

| Токен | Устанавливается в | Назначение |
|-------|-----------------|-----------|
| `--category-text-color` | `categoryColors.ts` | Цвет текста тега категории задачи |
| `--repeat-tag-color` | `categoryColors.ts` | Цвет текста тега «Повтор» |
| `--card-bg-gradient` | `categoryColors.ts` | Градиент фона карточки задачи (10 вариантов) |
| `--card-border-color` | `categoryColors.ts` | Граница карточки задачи |
| `--widget-custom-bg` | `idealWidgetThemes.ts` | Фон виджета прогресса (тема-preset) |
| `--widget-custom-border` | `idealWidgetThemes.ts` | Граница виджета |
| `--widget-custom-text` | `idealWidgetThemes.ts` | Цвет текста виджета |
| `--widget-custom-muted-text` | `idealWidgetThemes.ts` | Приглушённый текст виджета |
| `--widget-custom-accent` | `idealWidgetThemes.ts` | Акцент виджета |
| `--widget-custom-shadow` | `idealWidgetThemes.ts` | Тень виджета |

---

## Запрещённые паттерны

После рефакторинга в **компонентах и модулях CSS** запрещено:

```css
/* ❌ Запрещено — hardcoded hex */
color: #38bdf8;
background-color: #10b981;

/* ❌ Запрещено — hardcoded rgba */
background-color: rgba(255, 255, 255, 0.1);
border-color: rgba(99, 102, 241, 0.25);

/* ❌ Запрещено — hardcoded rgb */
color: rgb(248, 250, 252);
```

```tsx
// ❌ Запрещено — inline цвет в TSX
<div style={{ color: '#38bdf8' }} />
<span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }} />
```

```css
/* ✅ Правильно — только семантические токены */
color: var(--color-accent-text);
background-color: var(--color-accent-light);
border-color: var(--color-accent-border);
```

**Исключения** (технически неизбежны):
- Hardcoded `transparent` — допустимо
- Hardcoded `white` / `#ffffff` — допустимо только для текста **поверх solid accent кнопки** (on-accent)
- SVG `stroke="white"` — допустимо для иконки галочки в чекбоксе
- Inline `style` в dynamic-токенах (внутри `colorUtils.ts`, `categoryColors.ts`) — допустимо, так как это и есть точка инъекции токенов

---

## Рекомендации к улучшению

> Это предложения, которые **не будут реализованы автоматически**.  
> Каждое изменение требует отдельного подтверждения.

### Рекомендация 1: Чекбокс — `--color-accent` вместо `--color-success`

**Сейчас:** активный чекбокс заливается `--color-success` (зелёный), вне зависимости от акцентного цвета.

**Проблема:** Если пользователь выбрал зелёный акцент, чекбоксы и все «success»-элементы (banner «Все выполнено») выглядят идентично и теряют смысловое разграничение.

**Предложение:** Сделать заливку чекбокса `--color-accent`. Это паттерн из Things 3, Linear, Todoist — чекбокс всегда цвета акцента. `--color-success` остаётся для смысловых «completion» состояний (banner «Всё выполнено», полоска прогресса «100%»).

---

### Рекомендация 2: Архитектура `cardStyles.ts` — выделенные card-токены

**Сейчас:** `applyTaskCardStyle` перезаписывает глобальные `--color-surface`, `--color-border`, `--color-text-primary`. Это означает, что при выборе пользовательского стиля карточки меняются **все** элементы, использующие эти токены (кнопки, инпуты, боковые панели).

**Проблема:** Непредсказуемые побочные эффекты при смене стиля карточки.

**Предложение:** Ввести изолированные токены `--card-surface`, `--card-border`, `--card-text-primary` для задачных карточек, не затрагивающие глобальную систему. Или сохранить текущий подход, но явно задокументировать его как «intended override».

---

### Рекомендация 3: Упростить `HabitProgressBanner` — убрать сплошные плакатные варианты

**Сейчас:** Варианты 15–19 из `progressWidgetThemes.ts` используют полностью сплошную заливку акцентным цветом на большой поверхности баннера. Это нарушает принцип «акцент не заливает большие поверхности».

**Предложение:** Удалить сплошные варианты (15–19) или трансформировать их в варианты с акцентной полоской/рамкой вместо полной заливки. Сохранить мягкие градиентные варианты 1–14.

---

### Рекомендация 4: Унифицировать `--category-text-color` с `--color-accent-text`

**Сейчас:** Пользователь может выбрать отдельную палитру цветов для категорий (10 вариантов через `CATEGORY_TEXT_THEMES`), которая независима от акцентного цвета.

**Потенциальная проблема:** Возможен конфликт: пользователь выбрал янтарный акцент + янтарную категорийную тему — визуальная каша.

**Предложение:** Рассмотреть автоматическое производство цвета категорий от основного акцента (через HSL-смещение), сохранив 1–2 пользовательских палитры. Или добавить в UX предупреждение о конфликте.

---

*Документ подготовлен для ревью. Реализация начинается после подтверждения.*
