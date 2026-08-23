'use client';

import React from 'react';
import { WordForms } from '@/entities/english';
import { BookA } from 'lucide-react';

interface WordFormsGlobalProps {
  word: string;
  wordForms?: WordForms;
}

export const WordFormsGlobal: React.FC<WordFormsGlobalProps> = ({
  word,
  wordForms,
}) => {
  const forms = wordForms || {};
  const verb = forms.verbForms;
  const noun = forms.nounForms;
  const adj = forms.adjectiveForms;

  const hasForms =
    Boolean(verb?.past || verb?.pastParticiple || verb?.ing || noun?.plural || adj?.comparative || adj?.superlative);

  if (!hasForms) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '10px',
        color: 'var(--color-text-muted)',
        borderTop: '1px solid var(--color-border)',
        paddingTop: '3px',
        marginTop: 'auto',
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 800, textTransform: 'uppercase', fontSize: '9px', color: 'var(--color-text-secondary)', flexShrink: 0 }}>
        <BookA size={11} color="var(--color-accent-text)" />
        <span>Формы слова:</span>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap', flexShrink: 0 }}>
        {verb?.past && (
          <span>
            V2: <strong style={{ color: 'var(--color-text-primary)' }}>{verb.past}</strong>
          </span>
        )}
        {verb?.pastParticiple && (
          <span>
            V3: <strong style={{ color: 'var(--color-text-primary)' }}>{verb.pastParticiple}</strong>
          </span>
        )}
        {verb?.ing && (
          <span>
            -ing: <strong style={{ color: 'var(--color-text-primary)' }}>{verb.ing}</strong>
          </span>
        )}
        {noun?.plural && (
          <span>
            Plural: <strong style={{ color: 'var(--color-text-primary)' }}>{noun.plural}</strong>
          </span>
        )}
        {adj?.comparative && (
          <span>
            Comp: <strong style={{ color: 'var(--color-text-primary)' }}>{adj.comparative}</strong>
          </span>
        )}
        {adj?.superlative && (
          <span>
            Super: <strong style={{ color: 'var(--color-text-primary)' }}>{adj.superlative}</strong>
          </span>
        )}
      </div>
    </div>
  );
};
