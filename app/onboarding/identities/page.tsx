'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { set, STORAGE_KEYS } from '@/lib/storage';

const IDENTITIES = [
  { id: 'adhd', label: 'ADHD' },
  { id: 'autism', label: 'Autism' },
  { id: 'anxiety', label: 'Anxiety / nervous system' },
  { id: 'ocd', label: 'OCD' },
  { id: 'hsp', label: 'Highly sensitive' },
  { id: 'gifted', label: 'Gifted / 2e' },
  { id: 'exploring', label: 'Still figuring it out', italic: true },
];

export default function IdentitiesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const handleContinue = () => {
    set(STORAGE_KEYS.identities, Array.from(selected));
    router.push('/onboarding/your-person');
  };

  return (
    <main className="min-h-screen flex flex-col px-8 py-12">
      <div className="eyebrow">Step one of two</div>
      <h1 className="display mt-3">
        What resonates
        <br />
        with you?
      </h1>
      <p className="italic-quote text-muted mt-3" style={{ fontSize: '14px' }}>
        Select anything that fits. No diagnosis needed — just what feels true for you.
      </p>

      <div className="mt-8">
        {IDENTITIES.map((item, i) => {
          const isSelected = selected.has(item.id);
          const isLast = i === IDENTITIES.length - 1;
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`row-link w-full text-left flex items-baseline gap-2 ${isLast ? 'last' : ''}`}
              style={{
                fontStyle: item.italic ? 'italic' : 'normal',
                color: item.italic ? '#8E8780' : '#F1EDE5',
                background: 'transparent',
                border: 'none',
                borderBottom: isLast ? 'none' : '1px solid #1F1F26',
                fontFamily: 'inherit',
              }}
            >
              {isSelected && <span className="gold-dot" style={{ marginTop: 8 }} />}
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1" />
      <div className="flex justify-between items-center pt-4">
        <button onClick={handleContinue} className="action-btn-quiet">
          Skip
        </button>
        <button onClick={handleContinue} className="action-btn">
          Continue
        </button>
      </div>
    </main>
  );
}
