import type { Metadata } from 'next';
import { MainLayout } from '@/widgets/layout/ui/MainLayout';
import './globals.css';

export const metadata: Metadata = {
  title: 'SkillFlow — Personal Growth OS',
  description: 'Современное веб-приложение для личного развития, задач и обучения',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0f172a' }}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
