import { Suspense } from 'react';
import { CalendarPage } from '@/views/calendar/ui/CalendarPage';

export default function CalendarRoute() {
  return (
    <Suspense fallback={null}>
      <CalendarPage />
    </Suspense>
  );
}
