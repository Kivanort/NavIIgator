import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'О музее',
  description: 'Яндекс Музей — миссия, история и AI-технологии интерактивного гида.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
