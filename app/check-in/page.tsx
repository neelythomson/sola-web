'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addSkyStar, set, STORAGE_KEYS } from '@/lib/storage';
import TabBar from '@/components/TabBar';

const DIMENSIONS = [
  { id: 'energy', label: 'How is your energy today?', options: ['Empty', 'Low but here', 'Steady', 'Charged', 'Wired'] },
  { id: 'emotional', label: 'How are your feelings sitting?', options: ['Numb', 'Heavy', 'Steady', 'Tender', 'Loud'] },
  { id: 'sensory', label: "What's the world feeling like?", options: ['Muffled', 'A little loud', 'Just right', 'Sharp', 'Too much'] },
  { id: 'focus', label: 'What about your focus?', options: ['Scattered', 'Foggy', 'Steady', 'Lit up', 'Hyperfixated'] },
  { id: 'capacity', label: "What's your capacity?", options: ['Empty', 'Cushion', 'Steady', 'Stretching', 'Overflowing'] },
];

export default function CheckInPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const dim = DIMENSIONS[stepIndex];
  const isLast = stepIndex === DIMENSIONS.length - 1;

  const handleSelect = (option: string) => {
    const next = { ...answers, [dim.id]: option };
    setAnswers(next);
    if (isLast) {
      // Save + reward + go to the done screen which interprets the answers
      const todayKey = new Date().toISOString().split('T')[0];
      set(STORAGE_KEYS.lastCheckinDate, todayKey);
      addSkyStar('checkin');
      const checkins = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.checkins) || '[]');
      checkins.push({ date: new Date().toISOString(), answers: next });
      window.localStorage.setItem(STORAGE_KEYS.checkins, JSON.stringify(checkins));
      router.push('/check-in/done');
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleSkip = () => {
    if (isLast) router.push('/home');
    else setStepIndex(stepIndex + 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-8 py-12">
        <div className="kicker-muted mb-3">
          {stepIndex + 1} of {DIMENSIONS.length} · {dim.id}
        </div>
        <p className="italic-quote text-muted mb-10" style={{ fontSize: '14px' }}>
          No right answer. Just what&apos;s here.
        </p>

        <h1 className="display-lg mb-8">{dim.label}</h1>

        <div>
          {dim.options.map((opt, i) => {
            const isLastOpt = i === dim.options.length - 1;
            return (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className="row-link w-full text-left"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isLastOpt ? 'none' : '1px solid #1F1F26',
                  fontFamily: 'inherit',
                  fontStyle: 'italic',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#F1EDE5',
                  padding: '14px 0',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex gap-1 mt-8">
          {DIMENSIONS.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-px"
              style={{
                background: i === stepIndex ? '#D7BD8E' : i < stepIndex ? '#8E8780' : '#1F1F26',
                opacity: i < stepIndex ? 0.6 : 1,
              }}
            />
          ))}
        </div>

        <div className="flex-1" />
        <div className="flex justify-end pt-6">
          <button onClick={handleSkip} className="action-btn-quiet">
            Skip
          </button>
        </div>
      </main>
      <TabBar />
    </div>
  );
}
