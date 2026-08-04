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
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
