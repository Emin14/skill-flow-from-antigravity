'use client';

import React, { useEffect, useState } from 'react';
import { useEnglishStore, speakEnglishWord } from '@/entities/english';
import { EnglishTrainerModal } from '@/features/english-trainer';
import styles from './EnglishPage.module.css';

export const EnglishPage: React.FC = () => {
  const {
    session,
    settings,
    dictionaryWords,
    totalDictionaryWords,
    isLoadingDictionary,
    fetchSession,
    fetchSettings,
    updateSettings,
    searchDictionary,
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
    searchDictionary('', 'ALL', 'ALL', 1);
  }, [fetchSession, fetchSettings, searchDictionary]);

  const handleFilterChange = (query: string, level: string, status: string) => {
    searchDictionary(query, level, status, 1);
  };

  const newCount = session?.newWords?.length || 0;
  const reviewCount = session?.reviewWords?.length || 0;
  const totalToday = newCount + reviewCount;

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.pageHeader}>
        <div className={styles.titleArea}>
          <span style={{ fontSize: '32px' }}>🇬🇧</span>
          <div>
            <h1 className={styles.pageTitle}>Английский язык</h1>
            <p className={styles.subtitle}>Словарь Oxford 3000 (3 677 ключевых слов A1–B2)</p>
          </div>
        </div>

        <button className={styles.topActionBtn} onClick={() => setIsTrainerOpen(true)}>
          <span>▶</span>
          <span>Начать сессию ({totalToday})</span>
        </button>
      </div>

      {/* Tabs */}
      <div className={styles.tabsRow}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'practice' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          🔥 Тренировка и Статистика
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
              <span className={styles.statNumber}>{session?.totalWords || 3677}</span>
            </div>
          </div>

          <div className={styles.practiceCard}>
            <h3 className={styles.practiceTitle}>
              План на сегодня: {totalToday > 0 ? `${totalToday} слов` : 'Все слова выучены! 🎉'}
            </h3>
            <p className={styles.practiceDesc}>
              {totalToday > 0
                ? `${newCount} новых слов + ${reviewCount} на повторение по интервальной системе (SRS).`
                : `Вы успешно освоили сегодняшнюю норму (${session?.dailyLearnedCount || 0}/${session?.dailyTargetCount || 5} слов).`}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {totalToday > 0 ? (
                <button className={styles.topActionBtn} onClick={() => setIsTrainerOpen(true)}>
                  <span>▶</span>
                  <span>Запустить тренировку</span>
                </button>
              ) : (
                <button
                  className={styles.topActionBtn}
                  onClick={async () => {
                    await useEnglishStore.getState().resetTodayProgress();
                  }}
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}
                >
                  <span>🔄</span>
                  <span>Сбросить и пройти заново</span>
                </button>
              )}
            </div>
          </div>
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleFilterChange(e.target.value, selectedLevel, selectedStatus);
              }}
            />

            <select
              className={styles.selectInput}
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                handleFilterChange(searchQuery, e.target.value, selectedStatus);
              }}
            >
              <option value="ALL">Все уровни (CEFR)</option>
              <option value="A1">Уровень A1 (Начальный)</option>
              <option value="A2">Уровень A2 (Элементарный)</option>
              <option value="B1">Уровень B1 (Средний)</option>
              <option value="B2">Уровень B2 (Выше среднего)</option>
            </select>

            <select
              className={styles.selectInput}
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                handleFilterChange(searchQuery, selectedLevel, e.target.value);
              }}
            >
              <option value="ALL">Все статусы</option>
              <option value="NEW">Не начато</option>
              <option value="LEARNING">Изучается</option>
              <option value="REVIEW">На повторении</option>
              <option value="MASTERED">Выучено</option>
            </select>
          </div>

          {isLoadingDictionary ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Загрузка словаря...</div>
          ) : (
            <div className={styles.wordsGrid}>
              {dictionaryWords.map((w) => (
                <div key={w.id} className={styles.wordCard}>
                  <div className={styles.wordCardHeader}>
                    <span className={styles.wordCardTitle}>{w.word}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={styles.wordCardLevel}>{w.cefrLevel}</span>
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
