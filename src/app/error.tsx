'use client';

import React, { useEffect } from 'react';
import { Card, Typography, Button } from '@/shared/ui';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'var(--space-4)' }}>
      <Card style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: 'var(--space-8)' }}>
        <Typography variant="h1" style={{ marginBottom: 'var(--space-2)' }}>
          ⚠️ Что-то пошло не так
        </Typography>
        <Typography variant="body" style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
          Произошла непредвиденная ошибка при выполнении операции. Все ваши данные находятся в безопасности.
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)' }}>
          <Button variant="primary" onClick={() => reset()}>
            🔄 Попробовать снова
          </Button>
          <Button variant="secondary" onClick={() => (window.location.href = '/')}>
            🏠 На главную
          </Button>
        </div>
      </Card>
    </div>
  );
}
