'use client';

import React, { useEffect, useState } from 'react';
import { useEnglishStore, speakEnglishWord } from '@/entities/english';
import { EnglishTrainerModal } from '@/features/english-trainer';
import { Check } from 'lucide-react';
import styles from './EnglishPage.module.css';

export const EnglishPage: React.FC = () => {
  const {
    session,
    settings,
    dictionaryWords,
    totalDictionaryWords,
    isLoadingDictionary,
    isLoadingMoreDictionary,
    hasMoreDictionary,
    fetchSession,
    fetchSettings,
    updateSettings,
    searchDictionary,
    loadMoreDictionary,
  } = useEnglishStore();

  const [activeTab, setActiveTab] = useState<'practice' | 'dictionary' | 'settings'>('practice');
  const [isTrainerOpen, setIsTrainerOpen] = useState<boolean>(false);

  // Search filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    fetchSession();
    fetchSettings();
  }, [fetchSession, fetchSettings]);

  // Debounced search on query, level, or status change
  useEffect(() => {
    const timer = setTimeout(() => {
      searchDictionary(searchQuery, selectedLevel, selectedStatus, 1);
    }, 180);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedLevel, selectedStatus, searchDictionary]);

  const hasActiveFilters = searchQuery !== '' || selectedLevel !== 'ALL' || selectedStatus !== 'ALL';
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedLevel('ALL');
    setSelectedStatus('ALL');
  };

  const renderStatusBadge = (status?: string) => {
    switch (status) {
      case 'LEARNING':
        return <span className={`${styles.wordStatusBadge} ${styles.wordStatusLearning}`}>Изучается</span>;
      case 'REVIEW':
        return <span className={`${styles.wordStatusBadge} ${styles.wordStatusReview}`}>Повтор</span>;
      case 'MASTERED':
        return <span className={`${styles.wordStatusBadge} ${styles.wordStatusMastered}`}>Выучено ✓</span>;
      case 'NEW':
      default:
        return <span className={`${styles.wordStatusBadge} ${styles.wordStatusNew}`}>Не начато</span>;
    }
  };

  const newCount = session?.newWords?.length || 0;
  const reviewCount = session?.reviewWords?.length || 0;
  const totalToday = newCount + reviewCount;
  const isDoneToday = session?.isCompletedToday || (totalToday === 0 && (session?.dailyLearnedCount || 0) > 0);

  return (
    <div className={styles.container}>
      {/* Top Banner (Pure Minimalist Hero Ribbon - exact match with Projects and Habits) */}
      <div className={styles.pageHeader}>
        <div className={styles.headerTitleRow}>
          <h2 className={styles.pageTitle}>🇬🇧 Английский язык</h2>
          {totalToday > 0 && (
            <span className={styles.headerBadge}>
              План: {totalToday} слов
            </span>
          )}
          {session && session.streakDays > 0 && (
            <span className={styles.headerStreakBadge}>
              🔥 {session.streakDays} дн.
            </span>
          )}
        </div>
        <p className={styles.subtitle}>
          Словарь Oxford 5000: 4 963 ключевых слова A1–C1 по интервальной системе повторения (SRS).
        </p>
      </div>

      {/* Tabs */}
      <div className={styles.tabsRow}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'practice' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          📊 Статистика и Уровни
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'dictionary' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('dictionary')}
        >
          📖 Каталог слов ({totalDictionaryWords})
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙ Настройки
        </button>
      </div>

      {/* Tab: Practice & Stats */}
      {activeTab === 'practice' && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Дней подряд (Streak)</span>
              <span className={styles.statNumber}>🔥 {session?.streakDays || 0}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>В процессе изучения</span>
              <span className={styles.statNumber}>{session?.totalLearned || 0}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Выучено прочно (Mastered)</span>
              <span className={styles.statNumber}>{session?.totalMastered || 0}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Всего слов в базе</span>
              <span className={styles.statNumber}>{session?.totalWords || 4963}</span>
            </div>
          </div>

          {/* CEFR Level Progression Ladder */}
          {session?.levelStats && (
            <div className={styles.ladderSection}>
              <div className={styles.ladderHeader}>
                <div className={styles.ladderTitleGroup}>
                  <h3 className={styles.ladderTitle}>🎯 Уровневая лестница CEFR (Oxford 5000)</h3>
                  <p className={styles.ladderSubtitle}>Поэтапное освоение лексики от базового A1 до профессионального C1</p>
                </div>
              </div>

              <div className={styles.ladderRowsList}>
                {(['A1', 'A2', 'B1', 'B2', 'C1'] as const).map((lvl) => {
                  const stat = session.levelStats?.[lvl];
                  if (!stat) return null;
                  const isCurrent = stat.isCurrent;
                  const isCompleted = stat.isCompleted;
                  const isWaiting = !isCurrent && !isCompleted;

                  const badgeColors: Record<string, { bg: string; text: string; border: string; bar: string }> = {
                    A1: { bg: 'var(--color-success-light)', text: 'var(--color-success)', border: 'var(--color-success-border)', bar: 'var(--color-success)' },
                    A2: { bg: 'rgba(6, 182, 212, 0.12)', text: '#06b6d4', border: 'rgba(6, 182, 212, 0.3)', bar: '#06b6d4' },
                    B1: { bg: 'var(--color-accent-light)', text: 'var(--color-accent-text)', border: 'var(--color-accent-border)', bar: 'var(--color-accent)' },
                    B2: { bg: 'var(--color-warning-light)', text: 'var(--color-warning)', border: 'var(--color-warning-border)', bar: 'var(--color-warning)' },
                    C1: { bg: 'rgba(168, 85, 247, 0.14)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.35)', bar: '#a855f7' },
                  };
                  const colors = badgeColors[lvl] || badgeColors.A1;

                  return (
                    <div
                      key={lvl}
                      className={`
                        ${styles.ladderRowItem}
                        ${isWaiting ? styles.ladderRowItemWaiting : ''}
                      `}
                    >
                      <div className={styles.ladderRowLeft}>
                        <span
                          className={styles.levelItemBadge}
                          style={{
                            background: isWaiting ? 'var(--color-surface)' : colors.bg,
                            color: isWaiting ? 'var(--color-text-muted)' : colors.text,
                            border: `1px solid ${isWaiting ? 'var(--color-border)' : colors.border}`,
                          }}
                        >
                          {lvl}
                        </span>
                        <span className={styles.ladderRowTitle}>
                          <span>{stat.title.split(' ')[0]}</span>
                          {isCompleted && <Check size={13} style={{ color: 'var(--color-success)' }} />}
                        </span>
                      </div>

                      <div className={styles.ladderRowRight}>
                        <div className={styles.ladderCountGroup}>
                          <span className={styles.ladderCountLearned}>{stat.learned}</span>
                          <span className={styles.ladderCountDivider}>/</span>
                          <span className={styles.ladderCountTotal}>{stat.total}</span>
                        </div>
                        <span className={styles.ladderRowPercent} style={{ color: isWaiting ? 'var(--color-text-muted)' : colors.text }}>
                          {stat.percent}%
                        </span>
                      </div>

                      {/* Underline Progress Bar */}
                      <div className={styles.ladderRowBottomTrack}>
                        <div
                          className={styles.ladderRowBottomFill}
                          style={{
                            width: `${stat.percent}%`,
                            background: colors.bar,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Tab: Dictionary */}
      {activeTab === 'dictionary' && (
        <>
          <div className={styles.filterBar}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск по слову или переводу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
              className={styles.selectInput}
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="ALL">Все уровни (CEFR)</option>
              <option value="A1">Уровень A1 (Начальный)</option>
              <option value="A2">Уровень A2 (Элементарный)</option>
              <option value="B1">Уровень B1 (Средний)</option>
              <option value="B2">Уровень B2 (Выше среднего)</option>
              <option value="C1">Уровень C1 (Продвинутый)</option>
            </select>

            <select
              className={styles.selectInput}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="ALL">Все статусы</option>
              <option value="NEW">Не начато</option>
              <option value="LEARNING">Изучается</option>
              <option value="REVIEW">На повторении</option>
              <option value="MASTERED">Выучено</option>
            </select>
          </div>

          <div className={styles.filterSummaryRow}>
            <span className={styles.filterCountText}>
              Найдено слов: <strong>{totalDictionaryWords}</strong>
            </span>
            {hasActiveFilters && (
              <button className={styles.clearFilterBtn} onClick={handleClearFilters}>
                ✕ Сбросить фильтры
              </button>
            )}
          </div>

          {isLoadingDictionary ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '40px' }}>
              Загрузка словаря...
            </div>
          ) : dictionaryWords.length === 0 ? (
            <div className={styles.emptyStateBox}>
              <span style={{ fontSize: '28px' }}>🔍</span>
              <p>По вашему запросу ничего не найдено</p>
              {hasActiveFilters && (
                <button className={styles.clearFilterBtn} onClick={handleClearFilters}>
                  Сбросить фильтры
                </button>
              )}
            </div>
          ) : (
            <>
              <div className={styles.wordsGrid}>
                {dictionaryWords.map((w) => (
                  <div key={w.id} className={styles.wordCard}>
                    <div className={styles.wordCardHeader}>
                      <span className={styles.wordCardTitle}>{w.word}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={styles.wordCardLevel}>{w.cefrLevel}</span>
                        {renderStatusBadge(w.status)}
                        <button
                          className={styles.miniAudioBtn}
                          onClick={() => speakEnglishWord(w.word, settings.accent)}
                          title="Озвучить"
                        >
                          🔊
                        </button>
                      </div>
                    </div>
                    <div className={styles.wordCardTranscription}>{w.transcription}</div>
                    <div className={styles.wordCardTranslation}>
                      {w.translations.map((t) => t.meanings.join(', ')).join(' • ')}
                    </div>
                  </div>
                ))}
              </div>

              {hasMoreDictionary && (
                <div className={styles.loadMoreRow}>
                  <button
                    className={styles.loadMoreBtn}
                    onClick={() => loadMoreDictionary(searchQuery, selectedLevel, selectedStatus)}
                    disabled={isLoadingMoreDictionary}
                  >
                    {isLoadingMoreDictionary
                      ? 'Загрузка...'
                      : `Показать ещё (загружено ${dictionaryWords.length} из ${totalDictionaryWords})`}
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Tab: Settings */}
      {activeTab === 'settings' && (
        <div className={styles.settingsCard}>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              Новых слов в день: <strong>{settings.dailyNewWords}</strong>
            </div>
            <div className={styles.settingDesc}>Рекомендуется 5–10 слов для стабильного прогресса.</div>
            <input
              type="range"
              min="1"
              max="20"
              className={styles.rangeInput}
              value={settings.dailyNewWords}
              onChange={(e) => updateSettings({ dailyNewWords: parseInt(e.target.value, 10) })}
            />
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              Максимум повторений в день: <strong>{settings.maxReviewsPerDay}</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              className={styles.rangeInput}
              value={settings.maxReviewsPerDay}
              onChange={(e) => updateSettings({ maxReviewsPerDay: parseInt(e.target.value, 10) })}
            />
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>Акцент озвучки</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <label style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="accent"
                  checked={settings.accent === 'us'}
                  onChange={() => updateSettings({ accent: 'us' })}
                />
                🇺🇸 Американский (US)
              </label>
              <label style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="radio"
                  name="accent"
                  checked={settings.accent === 'uk'}
                  onChange={() => updateSettings({ accent: 'uk' })}
                />
                🇬🇧 Британский (UK)
              </label>
            </div>
          </div>
        </div>
      )}

      <EnglishTrainerModal
        isOpen={isTrainerOpen}
        onClose={() => setIsTrainerOpen(false)}
      />
    </div>
  );
};
