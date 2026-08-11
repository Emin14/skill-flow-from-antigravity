'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCategoryStore } from '@/entities/category/model/useCategoryStore';
import { getCategoryColor } from '@/shared/config/categoryColors';

interface CustomCategorySelectProps {
  value: string;
  onChange: (categoryName: string) => void;
  hintText?: string;
}

export const CustomCategorySelect: React.FC<CustomCategorySelectProps> = ({
  value,
  onChange,
  hintText = 'Категория',
}) => {
  const categories = useCategoryStore((s) => s.categories);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentCat = categories.find((c) => c.name === value);
  const catColor = currentCat?.color || getCategoryColor(value);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: '100%',
          height: '26px',
          padding: '2px 4px 1px 4px',
          borderRadius: 0,
          border: 'none',
          borderBottom: '1.5px solid var(--color-border-hover, rgba(255, 255, 255, 0.2))',
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          fontSize: '13.5px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: catColor,
              boxShadow: `0 0 7px ${catColor}a0`,
              flexShrink: 0,
            }}
          />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {value}
          </span>
        </div>
        <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', marginLeft: '4px', opacity: 0.7 }}>▼</span>
      </button>
      {hintText && (
        <span
          style={{
            display: 'block',
            fontSize: '10.5px',
            color: 'var(--color-text-muted)',
            paddingLeft: '2px',
            marginTop: '1px',
            letterSpacing: '0.01em',
            userSelect: 'none',
          }}
        >
          {hintText}
        </span>
      )}

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            zIndex: 10000,
            maxHeight: '210px',
            overflowY: 'auto',
            background: 'var(--color-surface, #1e293b)',
            border: '1px solid var(--color-border, rgba(255, 255, 255, 0.15))',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            padding: '4px',
          }}
        >
          {categories.map((cat) => {
            const color = cat.color || getCategoryColor(cat.name);
            const isSelected = cat.name === value;
            return (
              <button
                key={cat.id || cat.name}
                type="button"
                onClick={() => {
                  onChange(cat.name);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isSelected ? 'var(--color-accent-light, rgba(99, 102, 241, 0.15))' : 'transparent',
                  color: isSelected ? 'var(--color-accent-text, #a5b4fc)' : 'var(--color-text-primary)',
                  fontSize: '13px',
                  fontWeight: isSelected ? 600 : 400,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.12s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}90`,
                      flexShrink: 0,
                    }}
                  />
                  <span>{cat.name}</span>
                </div>
                {isSelected && <span style={{ fontSize: '12px' }}>✓</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
