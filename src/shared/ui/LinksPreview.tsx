import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';

interface LinksPreviewProps {
  text: string;
}

export const LinksPreview: React.FC<LinksPreviewProps> = ({ text }) => {
  const parsedUrls = useMemo(() => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return Array.from(new Set(text.match(urlRegex) || [])); // unique urls
  }, [text]);

  if (parsedUrls.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
      {parsedUrls.map((url, idx) => {
        let displayUrl = url;
        try {
          const urlObj = new URL(url);
          displayUrl = urlObj.hostname + (urlObj.pathname.length > 1 ? urlObj.pathname.substring(0, 15) + '...' : '');
        } catch(e) {}
        
        return (
          <a
            key={idx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: '11px',
              color: 'var(--color-accent-text, #60a5fa)',
              background: 'rgba(96, 165, 250, 0.1)',
              padding: '4px 8px',
              borderRadius: '6px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(96, 165, 250, 0.2)',
              transition: 'background 0.2s ease',
            }}
            title={url}
          >
            <ExternalLink size={12} />
            <span>{displayUrl}</span>
          </a>
        );
      })}
    </div>
  );
};
