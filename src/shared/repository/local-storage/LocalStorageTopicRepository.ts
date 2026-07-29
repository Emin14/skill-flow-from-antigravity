import { Topic } from '@/entities/topic/model/types';
import { TopicRepository } from '../interfaces/TopicRepository';

const STORAGE_KEY = 'skillflow_topics';

export class LocalStorageTopicRepository implements TopicRepository {
  private getStorage(): Topic[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private setStorage(topics: Topic[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(topics));
    } catch (e) {
      console.error('Failed to save topics to LocalStorage', e);
    }
  }

  async getAll(): Promise<Topic[]> {
    return this.getStorage();
  }

  async getByGoalId(goalId: string): Promise<Topic[]> {
    const topics = this.getStorage();
    return topics.filter((t) => t.goalId === goalId);
  }

  async getById(id: string): Promise<Topic | null> {
    const topics = this.getStorage();
    return topics.find((t) => t.id === id) || null;
  }

  async save(topic: Topic): Promise<Topic> {
    const topics = this.getStorage();
    const index = topics.findIndex((t) => t.id === topic.id);
    if (index >= 0) {
      topics[index] = topic;
    } else {
      topics.push(topic);
    }
    this.setStorage(topics);
    return topic;
  }

  async update(id: string, updates: Partial<Topic>): Promise<Topic> {
    const topics = this.getStorage();
    const index = topics.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Topic with id ${id} not found`);
    }

    const updated = { ...topics[index], ...updates };
    topics[index] = updated;
    this.setStorage(topics);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const topics = this.getStorage();
    const filtered = topics.filter((t) => t.id !== id);
    if (filtered.length === topics.length) return false;

    this.setStorage(filtered);
    return true;
  }
}

export const topicRepository = new LocalStorageTopicRepository();
