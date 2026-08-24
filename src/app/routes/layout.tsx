import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Маршруты',
  description: 'Выберите персонализированный маршрут по Яндекс Музею.',
};

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
