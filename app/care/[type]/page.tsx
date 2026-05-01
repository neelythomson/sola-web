'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addSkyStar } from '@/lib/storage';

type CareType = 'breath' | 'grounding' | 'sit-with-it' | 'permission' | 'one-thing' | 'values';

type Step = {
  // Either a heading + body string, or a list of items
  body: string;
  duration?: string;
};

type CareContent = {
  validation: string;
  steps: Step[];
  closing: string;
};

const CARE_CONTENT: Record<CareType, CareContent> = {
  breath: {
    validation: "One minute. The exhale is the work.",
    steps: [
      { body: "In through your nose for four counts.", duration: '4s' },
      { body: "Hold gently for four counts.", duration: '4s' },
      { body: "Out through your mouth for six counts. Slow.", duration: '6s' },
      { body: "Five rounds. Don't count perfectly. Just keep the exhale longer than the inhale.", duration: '~70s' },
    ],
    closing: "That's it. Your nervous system heard you.",
  },
  grounding: {
    validation: "Five things you can see, four you can touch, three you can hear, two you can smell, one you can taste.",
    steps: [
      { body: "Name five things you can see. Out loud or in your head. Don't judge them — just notice." },
      { body: "Four things you can touch. Hand on a surface, fabric, your own knee. Notice the texture." },
      { body: "Three things you can hear. The room is louder than you think." },
      { body: "Two things you can smell. If nothing, that's data too." },
      { body: "One thing you can taste. Even just the inside of your mouth." },
    ],
    closing: "You came back. The senses always know where you are.",
  },
  'sit-with-it': {
    validation: "Heavy is real. We're not fixing it — we're keeping it company.",
    steps: [
      { body: "Find somewhere to sit or lie down. Anywhere is fine." },
      { body: "Put a hand somewhere on your body — chest, cheek, your own arm. Press gently. Feel your own warmth." },
      { body: "Say to yourself, out loud or quietly: this is a heavy moment, and I am here for it." },
      { body: "Three slow breaths. The feeling doesn't have to leave. You don't have to make it leave." },
      { body: "Notice: you stayed. Even just this minute. That's not nothing." },
    ],
    closing: "Heavy is allowed to be heavy. You don't have to perform around it.",
  },
  permission: {
    validation: "Today is a small day. That's allowed.",
    steps: [
      { body: "You don't owe anyone a productive version of you today." },
      { body: "If you do nothing else: drink some water. That's a complete action." },
      { body: "If you do one more thing: pick something doable. Not ambitious. Doable." },
      { body: "Whatever you don't do today is allowed to wait. The world will hold." },
    ],
    closing: "Rest is a skill. You're using it.",
  },
  'one-thing': {
    validation: "Not the whole list. Not the right thing. Just one thing.",
    steps: [
      { body: "Forget what you're supposed to do. Drop the should." },
      { body: "Pick one micro-action. Examples: drink water. Send one text. Move to a different room. Wash your hands." },
      { body: "Set a timer for five minutes. Commit to the timer, not the task." },
      { body: "Start with your body, not your brain. Stand up. Take one step. Your brain will catch up." },
    ],
    closing: "Smallest. Step. Counts.",
  },
  values: {
    validation: "You're steady today. A small thing for the version of you who comes home tonight.",
    steps: [
      { body: "Name one thing you'd like to be a little more of, today: gentle, brave, honest, generous, slow, present." },
      { body: "Pick one — there's no right answer." },
      { body: "Notice one place in your day where that quality could show up. Not every place. One." },
      { body: "That's the seed. Plant it. See what grows." },
    ],
    closing: "Small seeds become the sky.",
  },
};

const TITLES: Record<CareType, string> = {
  breath: 'A breath',
  grounding: 'A return',
  'sit-with-it': 'Sit with it',
  permission: 'Permission',
  'one-thing': 'One thing',
  values: 'A seed',
};

export default function CarePage() {
  const params = useParams();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  const type = (params?.type as CareType) || 'breath';
  const content = CARE_CONTENT[type] || CARE_CONTENT.breath;
  const title = TITLES[type] || 'A breath';

  const isLast = stepIndex === content.steps.length - 1;
  const step = content.steps[stepIndex];

  const handleNext = () => {
    if (isLast) {
      addSkyStar('skill');
      setDone(true);
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else router.back();
  };

  if (done) {
    return (
      <main className="min-h-screen flex flex-col px-8 py-16 justify-center">
        <div className="eyebrow mb-3" style={{ color: '#8E8780' }}>
          A small thing, done
        </div>
        <p
          className="italic-quote"
          style={{ fontSize: '22px', lineHeight: 1.4, color: '#F1EDE5', marginBottom: 48 }}
        >
          {content.closing}
        </p>
        <div className="hairline-short mb-8" />
        <button
          onClick={() => router.push('/home')}
          className="action-btn text-left"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px 0' }}
        >
          Home
        </button>
        <button
          onClick={() => router.push('/sky')}
          className="action-btn-quiet text-left"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '14px 0' }}
        >
          See your sky
        </button>
        <div className="flex-1" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col px-8 py-12">
      <button
        onClick={() => router.push('/home')}
        className="self-end mb-2"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#8E8780',
          fontSize: 22,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        ✕
      </button>

      <div className="eyebrow" style={{ color: '#D7BD8E' }}>
        {title}
      </div>

      {stepIndex === 0 && (
        <p
          className="italic-quote mt-3 mb-6"
          style={{ fontSize: '17px', color: '#F1EDE5', lineHeight: 1.5 }}
        >
          {content.validation}
        </p>
      )}

      <div className="hairline-short my-6" />

      <div className="kicker-muted mb-4">
        Step {stepIndex + 1} of {content.steps.length}
        {step.duration ? ` · ${step.duration}` : ''}
      </div>

      <p
        style={{
          fontFamily: "'EB Garamond', Georgia, serif",
          fontSize: '17px',
          fontWeight: 400,
          lineHeight: 1.6,
          color: '#F1EDE5',
          letterSpacing: '-0.2px',
        }}
      >
        {step.body}
      </p>

      <div className="flex gap-1 mt-8">
        {content.steps.map((_, i) => (
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

      <div className="flex justify-between items-center pt-6">
        <button onClick={handlePrev} className="action-btn-quiet">
          {stepIndex === 0 ? 'Close' : 'Back'}
        </button>
        <button onClick={handleNext} className="action-btn">
          {isLast ? 'Done' : 'Next'}
        </button>
      </div>
    </main>
  );
}
