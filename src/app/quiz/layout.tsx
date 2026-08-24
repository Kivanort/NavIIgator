import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Квиз',
  description: 'Пройдите квиз и получите персонализированный маршрут по музею.',
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
