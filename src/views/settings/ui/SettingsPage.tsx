'use client';

import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, useToastStore } from '@/shared/ui';
import styles from './SettingsPage.module.css';

const colorPalettes = [
  { name: 'Фиолетовый (Aura)', hex: '#6366f1' },
  { name: 'Изумрудный', hex: '#10b981' },
  { name: 'Сапфировый', hex: '#3b82f6' },
  { name: 'Розовый', hex: '#f43f5e' },
  { name: 'Янтарный', hex: '#f59e0b' },
];

export const SettingsPage: React.FC = () => {
  const showToast = useToastStore((s) => s.showToast);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<'Monday' | 'Sunday'>('Monday');
  const [dateFormat, setDateFormat] = useState<'DD.MM.YYYY' | 'YYYY-MM-DD'>('DD.MM.YYYY');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('skillflow_theme') as 'dark' | 'light') || 'dark';
    const savedColor = localStorage.getItem('skillflow_accent_color') || '#6366f1';

    setTheme(savedTheme);
    setSelectedColor(savedColor);
  }, []);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('skillflow_theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    showToast(`Тема переключена на ${newTheme === 'dark' ? 'Темную' : 'Светлую'}`, 'success');
  };

  const handleColorChange = (hex: string) => {
    setSelectedColor(hex);
    localStorage.setItem('skillflow_accent_color', hex);
    document.documentElement.style.setProperty('--color-accent', hex);
    showToast('Основной цвет интерфейса обновлен!', 'success');
  };

  // Export JSON Backup
  const handleExportData = () => {
    const backupData: Record<string, unknown> = {};
    const keys = [
      'skillflow_goals',
      'skillflow_topics',
      'skillflow_tasks',
      'skillflow_materials',
      'skillflow_repeat_cards',
      'skillflow_inbox',
      'skillflow_activity_log',
    ];

    keys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          backupData[key] = JSON.parse(item);
        } catch {
          backupData[key] = item;
        }
      }
    });

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `skillflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast('Экспорт бэкапа завершен успешно!', 'success');
  };

  // Import JSON Backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          Object.keys(parsed).forEach((key) => {
            localStorage.setItem(key, JSON.stringify(parsed[key]));
          });
          showToast('Данные успешно импортированы! Перезагрузка...', 'success');
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } catch (err) {
          showToast('Ошибка при чтении файла бэкапа JSON', 'error');
        }
      };
    }
  };

  const handleResetData = () => {
    if (confirm('Вы действительно хотите сбросить ВСЕ локальные данные? Это действие необратимо.')) {
      localStorage.clear();
      showToast('Все данные сброшены. Перезагрузка...', 'warning');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <Typography variant="h1">⚙️ Настройки Приложения</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Персонализация внешнего вида, поведения системы и резервного копирования
        </Typography>
      </Card>

      {/* Appearance Settings */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">🎨 Внешний вид и Тема</Typography>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              Тема оформления
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Выберите между темной и светлой палитрой
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleThemeChange('dark')}
            >
              🌙 Темная
            </Button>
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleThemeChange('light')}
            >
              ☀️ Светлая
            </Button>
          </div>
        </div>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              Акцентный цвет интерфейса
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Основной цвет для кнопок, свечения и выделений
            </div>
          </div>
          <div className={styles.colorPickerRow}>
            {colorPalettes.map((pal) => (
              <button
                key={pal.hex}
                title={pal.name}
                className={`${styles.colorSwatch} ${selectedColor === pal.hex ? styles.colorSwatchActive : ''}`}
                style={{ backgroundColor: pal.hex }}
                onClick={() => handleColorChange(pal.hex)}
              />
            ))}
          </div>
        </div>
      </Card>

      {/* Regional & Calendar Settings */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">📅 Региональные настройки и Календарь</Typography>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              Первый день недели
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              С какого дня начинается расписание в сетке
            </div>
          </div>
          <select
            className={styles.selectInput}
            value={firstDayOfWeek}
            onChange={(e) => setFirstDayOfWeek(e.target.value as 'Monday' | 'Sunday')}
          >
            <option value="Monday">Понедельник</option>
            <option value="Sunday">Воскресенье</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
              Формат отображения дат
            </div>
          </div>
          <select
            className={styles.selectInput}
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value as 'DD.MM.YYYY' | 'YYYY-MM-DD')}
          >
            <option value="DD.MM.YYYY">ДД.ММ.ГГГГ (29.07.2026)</option>
            <option value="YYYY-MM-DD">ГГГГ-ММ-ДД (2026-07-29)</option>
          </select>
        </div>
      </Card>

      {/* Export & Import Data Backup */}
      <Card style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <Typography variant="h2">💾 Данные и Резервное Копирование</Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)' }}>
          Все ваши цели, темы, задачи, материалы и прогресс FSRS хранятся локально на этом устройстве.
        </Typography>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
          <Button variant="primary" onClick={handleExportData}>
            📥 Экспортировать бэкап (JSON)
          </Button>

          <label style={{ cursor: 'pointer' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-md)',
                fontWeight: 'var(--font-weight-medium)',
                minHeight: '44px',
              }}
            >
              📤 Импортировать бэкап (JSON)
            </span>
            <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
          </label>

          <Button variant="danger" onClick={handleResetData}>
            🗑 Сбросить все данные
          </Button>
        </div>
      </Card>
    </div>
  );
};
