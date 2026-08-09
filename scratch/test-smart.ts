import { prismaTaskRepository } from '../src/entities/task/api/prisma-task.repository';
import { v4 as uuidv4 } from 'uuid';

async function test() {
  try {
    const taskId = uuidv4();
    const task = {
      id: taskId,
      title: 'Тест умного повтора',
      status: 'Todo' as const,
      priority: 'P3' as const,
      category: 'Без категории',
      scheduledDate: '2026-08-09',
      description: '',
      link: '',
      parentTaskId: null,
      topicId: null,
      goalId: null,
      isRepeating: true,
      taskState: 'active' as const,
      repeatStatus: 'Active' as const,
      repetitionMode: 'smart' as const,
      scheduleFrequency: 'daily' as const,
      afterCompletionDays: 3,
      currentIntervalDays: 1.0,
      hasSubtasks: false,
      targetRepetitions: 8,
      repetitionsCount: 0,
      occurrences: [
        {
          id: uuidv4(),
          taskId,
          date: '2026-08-09',
          status: 'Todo' as const,
        },
      ],
      createdAt: new Date().toISOString(),
      pomodorosCount: 1,
    };

    console.log('Attempting to create task via prismaTaskRepository.create...');
    const result = await prismaTaskRepository.create(task as any);
    console.log('SUCCESS! Created task:', result.id);
    process.exit(0);
  } catch (err: any) {
    console.error('FAILED with error:', err);
    process.exit(1);
  }
}

test();
