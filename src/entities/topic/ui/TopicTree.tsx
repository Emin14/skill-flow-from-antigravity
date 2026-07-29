'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Topic } from '../model/types';
import { Task } from '@/entities/task/model/types';
import { Material } from '@/entities/material/model/types';
import { calculateTopicProgress } from '../lib/calculateCascade';
import { Progress, Button } from '@/shared/ui';

interface TopicTreeProps {
  goalId: string;
  parentId?: string | null;
  allTopics: Topic[];
  allTasks: Task[];
  allMaterials?: Material[];
  onAddSubtopic?: (parentId: string) => void;
  onDeleteTopic?: (topicId: string) => void;
}

export const TopicTree: React.FC<TopicTreeProps> = ({
  goalId,
  parentId = null,
  allTopics,
  allTasks,
  allMaterials = [],
  onAddSubtopic,
  onDeleteTopic,
}) => {
  const currentTopics = allTopics.filter((t) => t.goalId === goalId && t.parentId === parentId);

  if (currentTopics.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%' }}>
      {currentTopics.map((topic) => (
        <TopicNode
          key={topic.id}
          topic={topic}
          allTopics={allTopics}
          allTasks={allTasks}
          allMaterials={allMaterials}
          onAddSubtopic={onAddSubtopic}
          onDeleteTopic={onDeleteTopic}
        />
      ))}
    </div>
  );
};

interface TopicNodeProps {
  topic: Topic;
  allTopics: Topic[];
  allTasks: Task[];
  allMaterials?: Material[];
  onAddSubtopic?: (parentId: string) => void;
  onDeleteTopic?: (topicId: string) => void;
}

const TopicNode: React.FC<TopicNodeProps> = ({
  topic,
  allTopics,
  allTasks,
  allMaterials = [],
  onAddSubtopic,
  onDeleteTopic,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const childTopics = allTopics.filter((t) => t.parentId === topic.id);
  const topicProgress = calculateTopicProgress(topic.id, allTopics, allTasks, allMaterials);
  const topicTasks = allTasks.filter((t) => t.topicId === topic.id);
  const topicMaterials = allMaterials.filter((m) => m.topicId === topic.id);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Node Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: 1 }}>
          {childTopics.length > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                padding: '0 4px',
              }}
            >
              {isExpanded ? '▼' : '►'}
            </button>
          )}
          <Link
            href={`/topics/${topic.id}`}
            style={{
              fontSize: 'var(--font-size-md)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
            }}
          >
            {topic.title}
          </Link>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
            ({topicTasks.length} задач, {topicMaterials.length} матер.)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: '160px' }}>
          <div style={{ flex: 1 }}>
            <Progress value={topicProgress} height={6} />
          </div>
          <span
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-bold)',
              color: topicProgress === 100 ? 'var(--color-success)' : 'var(--color-accent)',
              minWidth: '36px',
              textAlign: 'right',
            }}
          >
            {topicProgress}%
          </span>
          {onAddSubtopic && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddSubtopic(topic.id)}
              title="Добавить подтему"
              style={{ fontSize: '12px', padding: '2px 6px' }}
            >
              ➕
            </Button>
          )}
          {onDeleteTopic && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTopic(topic.id)}
              title="Удалить тему"
              style={{ color: 'var(--color-text-muted)', padding: '2px 6px' }}
            >
              🗑
            </Button>
          )}
        </div>
      </div>

      {/* Children Subtopics (Recursive) */}
      {isExpanded && childTopics.length > 0 && (
        <div style={{ marginLeft: 'var(--space-5)', borderLeft: '2px solid var(--color-border)', paddingLeft: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
          <TopicTree
            goalId={topic.goalId}
            parentId={topic.id}
            allTopics={allTopics}
            allTasks={allTasks}
            allMaterials={allMaterials}
            onAddSubtopic={onAddSubtopic}
            onDeleteTopic={onDeleteTopic}
          />
        </div>
      )}
    </div>
  );
};
