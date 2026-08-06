import type { Metadata, Viewport } from 'next';
import { MainLayout } from '@/widgets/layout/ui/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillFlow — Personal Growth OS',
  description: 'Современное веб-приложение для личного развития, задач и обучения',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Montserrat:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Roboto:wght@400;500;700&family=Rubik:wght@400;500;600;700&display=swap&subset=cyrillic,cyrillic-ext"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
