import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const normalizedTasks = [
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

async function importJsonData() {
  console.log('🚀 Импорт пользовательских данных из JSON в PostgreSQL...');

  for (const taskData of normalizedTasks) {
    const { occurrences, ...taskBody } = taskData;

    await prisma.task.upsert({
      where: { id: taskBody.id },
      update: {},
      create: {
        ...taskBody,
        occurrences: {
          create: occurrences,
        },
      },
    });
  }

  console.log('🎉 Импорт успешно завершен! Все 21 пользовательские задачи загружены в PostgreSQL.');
}

importJsonData()
  .catch((e) => {
    console.error('❌ Ошибка при импорте JSON:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
