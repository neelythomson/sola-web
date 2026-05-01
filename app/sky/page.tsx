'use client';

import { useEffect, useState } from 'react';
import { getSkyStars, SkyStar } from '@/lib/storage';
import TabBar from '@/components/TabBar';

export default function SkyPage() {
  const [stars, setStars] = useState<SkyStar[]>([]);

  useEffect(() => {
    setStars(getSkyStars());
  }, []);

  // Spread real stars across the canvas pseudo-deterministically by index
  const positionedStars = stars.map((star, i) => {
    // Distribute around the canvas with some pseudo-random offset
    const seed = star.id.charCodeAt(0) + i * 37;
    const x = 30 + ((seed * 13) % 200);
    const y = 40 + ((seed * 17) % 240);
    const r = 1 + ((seed * 7) % 15) / 10;
    return { ...star, x, y, r };
  });

  // Add a few baseline scatter dots so the sky never feels empty
  const scatterDots = stars.length < 10
    ? [
        { x: 36, y: 56, r: 0.8, color: '#8E8780' },
        { x: 156, y: 74, r: 0.6, color: '#8E8780' },
        { x: 220, y: 184, r: 0.7, color: '#8E8780' },
        { x: 60, y: 220, r: 0.5, color: '#8E8780' },
        { x: 174, y: 36, r: 0.4, color: '#8E8780' },
        { x: 100, y: 256, r: 0.6, color: '#8E8780' },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-8 py-12">
        <h1 className="display" style={{ fontSize: '24px' }}>
          Your sky
        </h1>
        <p className="italic-quote text-muted mt-2" style={{ fontSize: '13px' }}>
          Every check-in, every skill, every quiet moment — it&apos;s all here.
        </p>

        <div className="mt-6 mx-auto" style={{ maxWidth: 280 }}>
          <svg viewBox="0 0 240 290" style={{ width: '100%' }}>
            {scatterDots.map((d, i) => (
              <circle key={`scatter-${i}`} cx={d.x} cy={d.y} r={d.r} fill={d.color} opacity="0.3" />
            ))}
            {positionedStars.map((s) => (
              <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill={s.color} />
            ))}
          </svg>
        </div>

        <div className="hairline mt-6" />
        <div className="flex justify-between mt-4 italic text-muted" style={{ fontSize: '13px' }}>
          <span>{stars.length} stars</span>
          <span>{stars.length === 0 ? 'A blank sky, for now' : `${countByCategory(stars)} kinds`}</span>
        </div>

        {stars.length === 0 && (
          <p className="italic text-muted mt-8" style={{ fontSize: '13px' }}>
            Stars appear when you check in, use a skill, or sit through a hard moment. Nothing is
            ever taken away.
          </p>
        )}
      </main>
      <TabBar />
    </div>
  );
}

function countByCategory(stars: SkyStar[]): number {
  const cats = new Set(stars.map((s) => s.category));
  return cats.size;
}
