const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ==========================================
// КЛАСС СТАТИСТИКИ ИМПОРТА
// ==========================================

class ImportReport {
  constructor() {
    this.stats = new Map();
  }

  initEntity(entityName, total) {
    this.stats.set(entityName, {
      entityName,
      total,
      successCount: 0,
      failureCount: 0,
      failedItems: [],
    });
  }

  recordSuccess(entityName) {
    const s = this.stats.get(entityName);
    if (s) s.successCount++;
  }

  recordFailure(entityName, id, errorMsg) {
    const s = this.stats.get(entityName);
    if (s) {
      s.failureCount++;
      s.failedItems.push({ id, error: errorMsg });
    }
  }

  printSummary() {
    console.log('\n==================================================');
    console.log('📊 ИТОГОВАЯ СТАТИСТИКА ИМПОРТА ДАННЫХ В POSTGRESQL');
    console.log('==================================================\n');

    let totalAll = 0;
    let successAll = 0;
    let failureAll = 0;

    for (const [entityName, stat] of this.stats.entries()) {
      totalAll += stat.total;
      successAll += stat.successCount;
      failureAll += stat.failureCount;

      const icon = stat.failureCount === 0 ? '✅' : '⚠️';
      console.log(`${icon} [${entityName}]: Обработано: ${stat.total} | Успешно: ${stat.successCount} | Ошибок: ${stat.failureCount}`);
      
      if (stat.failedItems.length > 0) {
        console.log(`   └─ Неудачные записи:`);
        stat.failedItems.forEach((item) => {
          console.log(`      • ID: ${item.id} -> Ошибка: ${item.error}`);
        });
      }
    }

    console.log('\n--------------------------------------------------');
    console.log(`🏆 ИТОГО: Всего записей: ${totalAll} | Загружено: ${successAll} | Ошибок: ${failureAll}`);
    console.log('==================================================\n');
  }
}

// ==========================================
// ДАННЫЕ СУЩНОСТЕЙ
// ==========================================

const goalsData = [
  {
    id: "goal-001",
    title: "Подготовка к Собеседованиям Frontend Senior",
    description: "Систематизировать знания по JS, TS, React, Next.js и алгоритмам",
    color: "#6366f1",
    status: "Active",
    createdAt: new Date("2026-06-01T10:00:00.000Z"),
  },
  {
    id: "goal-002",
    title: "Здоровье и Осанка",
    description: "Ежедневная разминка и тренировки",
    color: "#10b981",
    status: "Active",
    createdAt: new Date("2026-06-01T10:00:00.000Z"),
  }
];

const topicsData = [
  {
    id: "topic-001",
    goalId: "goal-001",
    title: "JavaScript & Async",
    weight: 1.0,
    createdAt: new Date("2026-06-01T10:00:00.000Z"),
  },
  {
    id: "topic-002",
    goalId: "goal-001",
    title: "Алгоритмы и Структуры данных",
    weight: 1.2,
    createdAt: new Date("2026-06-01T10:00:00.000Z"),
  }
];

const materialsData = [
  {
    id: "mat-001",
    topicId: "topic-001",
    title: "Глубокий разбор Promise API",
    description: "Promise.all, race, any, allSettled",
    type: "Article",
    content: "Подробная документация...",
    isCompleted: true,
    completedAt: new Date("2026-06-25T18:00:00.000Z"),
    createdAt: new Date("2026-06-24T10:00:00.000Z"),
  }
];

const repeatCardsData = [
  {
    id: "card-001",
    materialId: "mat-001",
    front: "В чем разница между Promise.all и Promise.allSettled?",
    back: "Promise.all падают при первом сбое, allSettled возвращает результаты всех промисов.",
    interval: 3,
    repetitions: 2,
    easeFactor: 2.5,
    nextReviewDate: "2026-08-10",
    lastReviewedAt: new Date("2026-08-07T12:00:00.000Z"),
    createdAt: new Date("2026-06-25T10:00:00.000Z"),
  }
];

const inboxData = [
  {
    id: "inbox-001",
    text: "Почитать про Turbopack в Next.js 16",
    isPinned: true,
    createdAt: new Date("2026-08-01T10:00:00.000Z"),
  }
];

const activityData = [
  {
    id: "act-001",
    type: "task_completed",
    title: "Завершена задача: Бинарный поиск числа",
    createdAt: new Date("2026-07-22T18:00:00.000Z"),
  }
];

// Полный нормализованный набор задач со скриншотов
const tasksData = [
  {
    id: "task-smart-001",
    title: "Одна из трудных задач: создание интерактивного обучающего модуля",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-21",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    goalId: "goal-001",
    createdAt: new Date("2026-06-11T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-001-1", date: "2026-06-11", status: "Done", pomodorosCount: 2, completedAt: new Date("2026-06-11T18:00:00.000Z") },
      { id: "occ-smart-001-2", date: "2026-07-21", status: "Done", pomodorosCount: 2, completedAt: new Date("2026-07-21T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-002",
    title: "Краткая самопрезентация (расскажи о себе, команды и стеки на каждом проекте)",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-15",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    goalId: "goal-001",
    createdAt: new Date("2026-06-17T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-002-1", date: "2026-06-17", status: "Done", completedAt: new Date("2026-06-17T18:00:00.000Z") },
      { id: "occ-smart-002-2", date: "2026-07-15", status: "Done", completedAt: new Date("2026-07-15T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-003",
    title: "Самая интересная задача (Модуль аналитики KPI менеджеров)",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-22",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    goalId: "goal-001",
    createdAt: new Date("2026-06-24T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-003-1", date: "2026-06-24", status: "Done", completedAt: new Date("2026-06-24T18:00:00.000Z") },
      { id: "occ-smart-003-2", date: "2026-07-22", status: "Done", completedAt: new Date("2026-07-22T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-004",
    title: "Реализовать Promise.any, Promise.race, Promise.all, Promise.allSettled",
    status: "Done",
    priority: "P2",
    category: "Задачи",
    scheduledDate: "2026-07-26",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-001",
    createdAt: new Date("2026-06-24T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-004-1", date: "2026-06-24", status: "Done", completedAt: new Date("2026-06-24T18:00:00.000Z") },
      { id: "occ-smart-004-2", date: "2026-06-28", status: "Done", completedAt: new Date("2026-06-28T18:00:00.000Z") },
      { id: "occ-smart-004-3", date: "2026-07-15", status: "Done", completedAt: new Date("2026-07-15T18:00:00.000Z") },
      { id: "occ-smart-004-4", date: "2026-07-26", status: "Done", completedAt: new Date("2026-07-26T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-005",
    title: "Про команды в каждом проекте и стэк",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-28",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-06-26T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-005-1", date: "2026-06-26", status: "Done", completedAt: new Date("2026-06-26T18:00:00.000Z") },
      { id: "occ-smart-005-2", date: "2026-07-28", status: "Done", completedAt: new Date("2026-07-28T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-006",
    title: "Полифил на .map",
    status: "Done",
    priority: "P2",
    category: "Задачи",
    scheduledDate: "2026-07-24",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-001",
    createdAt: new Date("2026-06-27T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-006-1", date: "2026-06-27", status: "Done", completedAt: new Date("2026-06-27T18:00:00.000Z") },
      { id: "occ-smart-006-2", date: "2026-07-24", status: "Done", pomodorosCount: 0.5, completedAt: new Date("2026-07-24T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-007",
    title: "Рассказать про разницу throttle и debounce и реализовать их",
    status: "Done",
    priority: "P2",
    category: "Практика Frontend",
    scheduledDate: "2026-07-25",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-001",
    createdAt: new Date("2026-06-28T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-007-1", date: "2026-06-28", status: "Done", completedAt: new Date("2026-06-28T18:00:00.000Z") },
      { id: "occ-smart-007-2", date: "2026-07-25", status: "Done", completedAt: new Date("2026-07-25T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-008",
    title: "Про процессы",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-20",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-07-20T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-008-1", date: "2026-07-20", status: "Done", completedAt: new Date("2026-07-20T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-009",
    title: "Одна из трудных задач: показ бонусов за быструю оплату заявки",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-20",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-07-20T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-009-1", date: "2026-07-20", status: "Done", completedAt: new Date("2026-07-20T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-010",
    title: "Бинарный поиск числа (Binary Search)",
    status: "Done",
    priority: "P2",
    category: "Задачи",
    link: "https://app.yeahub.ru/tasks/7350712c-295c-48d8-a4d9-7acd683c78b7",
    scheduledDate: "2026-07-22",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-002",
    createdAt: new Date("2026-07-22T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-010-1", date: "2026-07-22", status: "Done", pomodorosCount: 1, completedAt: new Date("2026-07-22T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-011",
    title: "Скользящее среднее (Moving Average)",
    status: "Done",
    priority: "P2",
    category: "Задачи",
    link: "https://app.yeahub.ru/tasks/c58f0c08-2a89-4eba-96f3-6752cc1141da",
    scheduledDate: "2026-07-22",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-002",
    createdAt: new Date("2026-07-22T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-011-1", date: "2026-07-22", status: "Done", pomodorosCount: 1, completedAt: new Date("2026-07-22T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-012",
    title: "Объединение товаров по названию (Merge Products by Name)",
    status: "Done",
    priority: "P2",
    category: "Задачи",
    link: "https://app.yeahub.ru/tasks/8da6c2be-fdb9-49d2-b0cf-9d7875b4c228",
    scheduledDate: "2026-07-24",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-002",
    createdAt: new Date("2026-07-24T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-012-1", date: "2026-07-24", status: "Done", pomodorosCount: 0.5, completedAt: new Date("2026-07-24T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-013",
    title: "TS #14",
    status: "Done",
    priority: "P2",
    category: "Задачи",
    link: "https://www.hackfrontend.com/ru/problems/ts-problems/my-parameters",
    scheduledDate: "2026-07-24",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-001",
    createdAt: new Date("2026-07-24T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-013-1", date: "2026-07-24", status: "Done", pomodorosCount: 0.5, completedAt: new Date("2026-07-24T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-014",
    title: "TS #18",
    status: "Done",
    priority: "P2",
    category: "Задачи",
    link: "https://www.hackfrontend.com/ru/problems/ts-problems/my-uppercase",
    scheduledDate: "2026-07-25",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-001",
    createdAt: new Date("2026-07-25T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-014-1", date: "2026-07-25", status: "Done", completedAt: new Date("2026-07-25T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-015",
    title: "Разделы в CRM",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-23",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-07-23T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-015-1", date: "2026-07-23", status: "Done", pomodorosCount: 0.33, completedAt: new Date("2026-07-23T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-016",
    title: "Почему Next.js",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-23",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-07-23T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-016-1", date: "2026-07-23", status: "Done", pomodorosCount: 0.33, completedAt: new Date("2026-07-23T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-017",
    title: "Страница подбора туров",
    status: "Done",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-23",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-07-23T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-017-1", date: "2026-07-23", status: "Done", pomodorosCount: 0.33, completedAt: new Date("2026-07-23T18:00:00.000Z") }
    ]
  },
  {
    id: "task-smart-018",
    title: "Моковое собеседование",
    status: "Todo",
    priority: "P2",
    category: "Моковое собес-ние",
    scheduledDate: "2026-07-23",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-07-23T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-018-1", date: "2026-07-23", status: "Todo" }
    ]
  },
  {
    id: "task-smart-019",
    title: "Растяжка бедра",
    status: "Todo",
    priority: "P2",
    category: "Здоровье",
    scheduledDate: "2026-07-24",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    goalId: "goal-002",
    createdAt: new Date("2026-07-24T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-019-1", date: "2026-07-24", status: "Todo" }
    ]
  },
  {
    id: "task-smart-020",
    title: "Реализовать свой ci/cd",
    status: "Todo",
    priority: "P2",
    category: "Практика Frontend",
    scheduledDate: "2026-07-27",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    topicId: "topic-001",
    createdAt: new Date("2026-07-27T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-020-1", date: "2026-07-27", status: "Todo" }
    ]
  },
  {
    id: "task-smart-021",
    title: "ci/cd и на камеру рассказать",
    status: "Todo",
    priority: "P2",
    category: "Опыт на камеру",
    scheduledDate: "2026-07-30",
    isRepeating: true,
    repeatStatus: "Active",
    repetitionMode: "smart",
    createdAt: new Date("2026-07-30T10:00:00.000Z"),
    occurrences: [
      { id: "occ-smart-021-1", date: "2026-07-30", status: "Todo" }
    ]
  }
];

// ==========================================
// ДИСКРЕТНЫЕ ФУНКЦИИ ИМПОРТА СУЩНОСТЕЙ
// ==========================================

async function importGoals(report) {
  report.initEntity('Goal', goalsData.length);
  console.log(`📦 Импорт сущности Goal (${goalsData.length} записей)...`);

  for (let i = 0; i < goalsData.length; i++) {
    const item = goalsData[i];
    try {
      await prisma.goal.upsert({
        where: { id: item.id },
        update: {
          title: item.title,
          description: item.description,
          color: item.color,
          status: item.status,
        },
        create: item,
      });
      report.recordSuccess('Goal');
    } catch (err) {
      report.recordFailure('Goal', item.id, err.message || String(err));
    }
  }
}

async function importTopics(report) {
  report.initEntity('Topic', topicsData.length);
  console.log(`📦 Импорт сущности Topic (${topicsData.length} записей)...`);

  for (let i = 0; i < topicsData.length; i++) {
    const item = topicsData[i];
    try {
      await prisma.topic.upsert({
        where: { id: item.id },
        update: {
          goalId: item.goalId,
          title: item.title,
          weight: item.weight,
        },
        create: item,
      });
      report.recordSuccess('Topic');
    } catch (err) {
      report.recordFailure('Topic', item.id, err.message || String(err));
    }
  }
}

async function importMaterials(report) {
  report.initEntity('Material', materialsData.length);
  console.log(`📦 Импорт сущности Material (${materialsData.length} записей)...`);

  for (let i = 0; i < materialsData.length; i++) {
    const item = materialsData[i];
    try {
      await prisma.material.upsert({
        where: { id: item.id },
        update: {
          topicId: item.topicId,
          title: item.title,
          description: item.description,
          type: item.type,
          content: item.content,
          isCompleted: item.isCompleted,
          completedAt: item.completedAt,
        },
        create: item,
      });
      report.recordSuccess('Material');
    } catch (err) {
      report.recordFailure('Material', item.id, err.message || String(err));
    }
  }
}

async function importRepeatCards(report) {
  report.initEntity('RepeatCard', repeatCardsData.length);
  console.log(`📦 Импорт сущности RepeatCard (${repeatCardsData.length} записей)...`);

  for (let i = 0; i < repeatCardsData.length; i++) {
    const item = repeatCardsData[i];
    try {
      await prisma.repeatCard.upsert({
        where: { id: item.id },
        update: {
          materialId: item.materialId,
          front: item.front,
          back: item.back,
          interval: item.interval,
          repetitions: item.repetitions,
          easeFactor: item.easeFactor,
          nextReviewDate: item.nextReviewDate,
          lastReviewedAt: item.lastReviewedAt,
        },
        create: item,
      });
      report.recordSuccess('RepeatCard');
    } catch (err) {
      report.recordFailure('RepeatCard', item.id, err.message || String(err));
    }
  }
}

async function importInbox(report) {
  report.initEntity('InboxItem', inboxData.length);
  console.log(`📦 Импорт сущности InboxItem (${inboxData.length} записей)...`);

  for (let i = 0; i < inboxData.length; i++) {
    const item = inboxData[i];
    try {
      await prisma.inboxItem.upsert({
        where: { id: item.id },
        update: {
          text: item.text,
          isPinned: item.isPinned,
        },
        create: item,
      });
      report.recordSuccess('InboxItem');
    } catch (err) {
      report.recordFailure('InboxItem', item.id, err.message || String(err));
    }
  }
}

async function importActivityLogs(report) {
  report.initEntity('ActivityLog', activityData.length);
  console.log(`📦 Импорт сущности ActivityLog (${activityData.length} записей)...`);

  for (let i = 0; i < activityData.length; i++) {
    const item = activityData[i];
    try {
      await prisma.activityLog.upsert({
        where: { id: item.id },
        update: {
          type: item.type,
          title: item.title,
        },
        create: item,
      });
      report.recordSuccess('ActivityLog');
    } catch (err) {
      report.recordFailure('ActivityLog', item.id, err.message || String(err));
    }
  }
}

async function importTasks(report) {
  report.initEntity('Task', tasksData.length);
  console.log(`📦 Импорт сущностей Task & TaskOccurrence (${tasksData.length} задач)...`);

  for (let i = 0; i < tasksData.length; i++) {
    const taskData = tasksData[i];
    const { occurrences, ...taskBody } = taskData;

    try {
      await prisma.task.upsert({
        where: { id: taskBody.id },
        update: {
          title: taskBody.title,
          status: taskBody.status,
          priority: taskBody.priority,
          category: taskBody.category,
          scheduledDate: taskBody.scheduledDate,
          isRepeating: taskBody.isRepeating,
          repeatStatus: taskBody.repeatStatus,
          repetitionMode: taskBody.repetitionMode,
          topicId: taskBody.topicId,
          goalId: taskBody.goalId,
        },
        create: taskBody,
      });

      if (occurrences && occurrences.length > 0) {
        for (const occ of occurrences) {
          await prisma.taskOccurrence.upsert({
            where: { id: occ.id },
            update: {
              taskId: taskBody.id,
              date: occ.date,
              status: occ.status,
              completedAt: occ.completedAt || null,
              pomodorosCount: occ.pomodorosCount || null,
            },
            create: {
              id: occ.id,
              taskId: taskBody.id,
              date: occ.date,
              status: occ.status,
              completedAt: occ.completedAt || null,
              pomodorosCount: occ.pomodorosCount || null,
            },
          });
        }
      }

      report.recordSuccess('Task');
    } catch (err) {
      report.recordFailure('Task', taskData.id, err.message || String(err));
    }

    if ((i + 1) % 5 === 0 || i === tasksData.length - 1) {
      console.log(`   └─ Обработано Задач: ${i + 1}/${tasksData.length}`);
    }
  }
}

// ==========================================
// ГЛАВНЫЙ СЦЕНАРИЙ ВЫПОЛНЕНИЯ
// ==========================================

async function main() {
  console.log('🚀 Запуск импорта данных в PostgreSQL через Prisma (CommonJS)...\n');
  const report = new ImportReport();

  await importGoals(report);
  await importTopics(report);
  await importMaterials(report);
  await importRepeatCards(report);
  await importInbox(report);
  await importActivityLogs(report);
  await importTasks(report);

  report.printSummary();
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при импорте:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
