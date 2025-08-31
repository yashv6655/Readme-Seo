import { Hero } from '@/components/landing/hero';
import { Features } from '@/components/landing/features';
import { Comparison } from '@/components/landing/comparison';

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <Features />
      <Comparison />
    </div>
  );
}
