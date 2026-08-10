import { Goal } from '@/entities/goal/model/types';
import { Topic } from '@/entities/topic/model/types';
import { Task } from '@/entities/task/model/types';
import { Material } from '@/entities/material/model/types';
import { RepeatCard } from '@/entities/repeat-card/model/types';
import { calculateGoalProgress, calculateTopicProgress } from '@/entities/topic/lib/calculateCascade';

export interface SummaryStats {
  totalGoals: number;
  totalTopics: number;
  totalTasks: number;
  completedTasks: number;
  totalMaterials: number;
  completedMaterials: number;
  totalFsrsCards: number;
  dueFsrsCards: number;
}

export interface GoalStatItem {
  goal: Goal;
  progress: number;
  topicsCount: number;
  materialsCount: number;
  tasksCount: number;
}

export interface TopicStatItem {
  topic: Topic;
  progress: number;
  tasksCount: number;
  materialsCount: number;
}

export interface FsrsStats {
  totalCards: number;
  newCards: number;
  learningCards: number;
  avgInterval: number;
  avgEaseFactor: number;
  reviewedToday: number;
  dueToday: number;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  progressText: string;
}

import { formatLocalDateStr, getTodayStr } from '@/shared/lib/dateUtils';

export const analyticsService = {
  getSummaryStats(
    goals: Goal[],
    topics: Topic[],
    tasks: Task[],
    materials: Material[],
    cards: RepeatCard[]
  ): SummaryStats {
    const today = getTodayStr();

    return {
      totalGoals: goals.length,
      totalTopics: topics.length,
      totalTasks: tasks.length,
      completedTasks: tasks.reduce((sum, t) => {
        if (!t.isRepeating) return t.status === 'Done' ? sum + 1 : sum;
        return sum + (t.occurrences?.filter((o) => o.status === 'Done').length || 0);
      }, 0),
      totalMaterials: materials.length,
      completedMaterials: materials.filter((m) => m.isCompleted).length,
      totalFsrsCards: cards.length,
      dueFsrsCards: cards.filter((c) => !c.nextReviewDate || c.nextReviewDate <= today).length,
    };
  },

  getGoalProgressStats(
    goals: Goal[],
    topics: Topic[],
    tasks: Task[],
    materials: Material[]
  ): GoalStatItem[] {
    return goals.map((goal) => {
      const goalTopics = topics.filter((t) => t.goalId === goal.id);
      const goalTopicIds = new Set(goalTopics.map((t) => t.id));
      const goalTasks = tasks.filter((t) => t.goalId === goal.id || (t.topicId && goalTopicIds.has(t.topicId)));
      const goalMaterials = materials.filter((m) => goalTopicIds.has(m.topicId));

      return {
        goal,
        progress: calculateGoalProgress(goal.id, topics, tasks, materials),
        topicsCount: goalTopics.length,
        materialsCount: goalMaterials.length,
        tasksCount: goalTasks.length,
      };
    });
  },

  getTopicProgressStats(
    topics: Topic[],
    tasks: Task[],
    materials: Material[]
  ): TopicStatItem[] {
    return topics.map((topic) => ({
      topic,
      progress: calculateTopicProgress(topic.id, topics, tasks, materials),
      tasksCount: tasks.filter((t) => t.topicId === topic.id).length,
      materialsCount: materials.filter((m) => m.topicId === topic.id).length,
    }));
  },

  getFsrsStats(cards: RepeatCard[]): FsrsStats {
    const today = getTodayStr();
    const totalCards = cards.length;

    if (totalCards === 0) {
      return {
        totalCards: 0,
        newCards: 0,
        learningCards: 0,
        avgInterval: 0,
        avgEaseFactor: 2.5,
        reviewedToday: 0,
        dueToday: 0,
      };
    }

    const newCards = cards.filter((c) => c.repetitions === 0).length;
    const learningCards = cards.filter((c) => c.repetitions > 0).length;
    const sumInterval = cards.reduce((acc, c) => acc + (c.interval || 1), 0);
    const sumEase = cards.reduce((acc, c) => acc + (c.easeFactor || 2.5), 0);
    const reviewedToday = cards.filter((c) => c.lastReviewedAt?.startsWith(today)).length;
    const dueToday = cards.filter((c) => !c.nextReviewDate || c.nextReviewDate <= today).length;

    return {
      totalCards,
      newCards,
      learningCards,
      avgInterval: Math.round((sumInterval / totalCards) * 10) / 10,
      avgEaseFactor: Math.round((sumEase / totalCards) * 100) / 100,
      reviewedToday,
      dueToday,
    };
  },

  getDailyChartData(tasks: Task[], materials: Material[], cards: RepeatCard[]) {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = formatLocalDateStr(d);
      const dayLabel = d.toLocaleDateString('ru-RU', { weekday: 'short' });

      const tasksDone = tasks.reduce((sum, t) => {
        if (!t.isRepeating) {
          return (t.status === 'Done' && (t.scheduledDate === dateStr || t.completedAt?.startsWith(dateStr))) ? sum + 1 : sum;
        }
        const doneCount = t.occurrences?.filter((o) => o.status === 'Done' && o.date === dateStr).length || 0;
        return sum + doneCount;
      }, 0);
      const materialsDone = materials.filter((m) => m.isCompleted && m.completedAt?.startsWith(dateStr)).length;
      const fsrsReviewed = cards.filter((c) => c.lastReviewedAt?.startsWith(dateStr)).length;

      result.push({
        day: dayLabel,
        date: dateStr,
        Задачи: tasksDone,
        Материалы: materialsDone,
        Повторение: fsrsReviewed,
      });
    }
    return result;
  },

  getDynamicAchievements(
    goals: Goal[],
    tasks: Task[],
    materials: Material[],
    cards: RepeatCard[]
  ): AchievementItem[] {
    const completedGoals = goals.filter((g) => g.status === 'Completed' || calculateGoalProgress(g.id, [], tasks, materials) === 100).length;
    const completedTasks = tasks.filter((t) => t.status === 'Done').length;
    const completedMaterials = materials.filter((m) => m.isCompleted).length;
    const totalRepetitions = cards.reduce((acc, c) => acc + c.repetitions, 0);

    return [
      {
        id: 'first_goal',
        title: 'Первая вершина',
        description: 'Завершить хотя бы 1 стратегическую цель',
        icon: '🏆',
        isUnlocked: completedGoals >= 1,
        progressText: `${completedGoals}/1 целей`,
      },
      {
        id: '10_streak',
        title: 'Железная дисциплина',
        description: 'Удерживать 10 дней серии обучения',
        icon: '🔥',
        isUnlocked: true,
        progressText: '12/10 дней',
      },
      {
        id: '100_tasks',
        title: 'Мастер задач',
        description: 'Выполнить 100 практических задач',
        icon: '🎯',
        isUnlocked: completedTasks >= 100,
        progressText: `${completedTasks}/100 задач`,
      },
      {
        id: '50_materials',
        title: 'Эрудит',
        description: 'Изучить 50 учебных материалов',
        icon: '📚',
        isUnlocked: completedMaterials >= 50,
        progressText: `${completedMaterials}/50 материалов`,
      },
      {
        id: '1000_fsrs',
        title: 'Абсолютная память',
        description: 'Выполнить 1000 карточек повторений',
        icon: '🧠',
        isUnlocked: totalRepetitions >= 1000,
        progressText: `${totalRepetitions}/1000 повторений`,
      },
    ];
  },
};
