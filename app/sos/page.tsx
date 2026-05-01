'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SOS_STATES,
  SOS_BRANCH_OPTIONS,
  SosState,
  SosBranchOption,
} from '@/lib/data/sos-states';
import {
  startSosSession,
  updateSosSession,
  completeSosSession,
  getYourPerson,
  YourPerson,
  buildSmsUrl,
  buildTelUrl,
  YOUR_PERSON_DEFAULT_OPENER,
  addSkyStar,
} from '@/lib/storage';
import TabBar from '@/components/TabBar';

type Phase = 'select' | 'out-of-app' | 'stabilizing' | 'aftermath' | 'branching';

export default function SosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phase, setPhase] = useState<Phase>('select');
  const [stateId, setStateId] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [yourPerson, setYourPersonState] = useState<YourPerson | null>(null);

  useEffect(() => {
    setYourPersonState(getYourPerson());
  }, []);

  // Deep link: ?state=<id> auto-selects an SOS state on mount.
  // Used by the post-check-in offer screen to route directly into the right
  // stabilization flow (e.g. "loud emotional" → emotional-flooding).
  useEffect(() => {
    const requested = searchParams?.get('state');
    if (!requested || stateId) return;
    const target = SOS_STATES.find((s) => s.id === requested);
    if (!target) return;
    setStateId(target.id);
    setStepIndex(0);
    if (target.routing === 'out-of-app-immediate') {
      setPhase('out-of-app');
    } else {
      startSosSession(target.id);
      setPhase('stabilizing');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const state: SosState | undefined = SOS_STATES.find((s) => s.id === stateId);

  const handleSelect = (s: SosState) => {
    setStateId(s.id);
    setStepIndex(0);
    if (s.routing === 'out-of-app-immediate') {
      setPhase('out-of-app');
    } else {
      startSosSession(s.id);
      setPhase('stabilizing');
    }
  };

  const handleNext = () => {
    if (!state) return;
    const last = state.stabilizationSteps.length - 1;
    if (stepIndex < last) {
      const next = stepIndex + 1;
      setStepIndex(next);
      updateSosSession({ stage: 'stabilizing', stepIndex: next });
    } else {
      setPhase('aftermath');
      updateSosSession({ stage: 'aftermath', stepIndex: 0 });
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      setStateId(null);
      setPhase('select');
    }
  };

  const handleAftermathOkay = () => {
    addSkyStar('sos');
    completeSosSession();
    router.push('/home');
  };

  const handleAftermathMore = () => {
    setPhase('branching');
    updateSosSession({ stage: 'branching', stepIndex: 0 });
  };

  const handleBranch = (option: SosBranchOption) => {
    if (option.comingSoon) {
      const message =
        option.id === 'human'
          ? 'Same-day connection with a licensed mental health professional is launching soon, starting in Mississippi. We\'ll let you know the moment it\'s live. For now, the crisis line and your person are still right here.'
          : 'This piece is on its way. For now, try one of the other options or close the app gently — you\'ve already done a lot.';
      alert(message);
      return;
    }
    addSkyStar('sos');
    completeSosSession();
    if (option.id === 'dbt' || option.id === 'mindfulness' || option.id === 'psychoeducation') {
      router.push('/toolkit');
    } else {
      router.push('/home');
    }
  };

  const handleClose = () => router.push('/home');

  if (phase === 'out-of-app' && state) {
    return <OutOfApp state={state} onClose={handleClose} />;
  }
  if (phase === 'stabilizing' && state) {
    return (
      <Stabilizing
        state={state}
        stepIndex={stepIndex}
        yourPerson={yourPerson}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={handleClose}
      />
    );
  }
  if (phase === 'aftermath' && state) {
    return (
      <Aftermath
        state={state}
        yourPerson={yourPerson}
        onOkay={handleAftermathOkay}
        onMore={handleAftermathMore}
      />
    );
  }
  if (phase === 'branching' && state) {
    return <Branching onSelect={handleBranch} onClose={handleAftermathOkay} />;
  }

  // Select screen (default)
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-8 py-12">
        <h1 className="display">
          What&apos;s
          <br />
          here?
        </h1>
        <p className="italic-quote text-muted mt-3" style={{ fontSize: '14px' }}>
          Pick what feels closest.
        </p>

        <div className="mt-8">
          {SOS_STATES.map((s, i) => {
            const isHarm = s.id.startsWith('harm-');
            const isLast = i === SOS_STATES.length - 1;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className="row-link w-full text-left flex items-baseline gap-2"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isLast ? 'none' : '1px solid #1F1F26',
                  fontFamily: 'inherit',
                  fontSize: '17px',
                  cursor: 'pointer',
                  color: '#F1EDE5',
                  letterSpacing: '-0.2px',
                }}
              >
                {isHarm && <span className="gold-dot" style={{ marginTop: 8 }} />}
                <span className="flex-1">
                  {s.label}
                  {s.id === 'harm-others' && (
                    <span className="row-sub">— this one&apos;s for in-person care</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1" />
      </main>
      <TabBar />
    </div>
  );
}

/* ============================================================ */

function OutOfApp({ state, onClose }: { state: SosState; onClose: () => void }) {
  return (
    <main className="min-h-screen flex flex-col px-8 py-12" style={{ background: '#1F1518' }}>
      <button
        onClick={onClose}
        className="self-end text-2xl"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#8E8780',
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginBottom: 8,
        }}
      >
        ✕
      </button>

      <div className="flex-1 flex flex-col justify-center">
        <h1 className="display-lg" style={{ color: '#9A6868' }}>
          This needs
          <br />
          a person.
          <br />
          In person.
        </h1>
        <p className="italic-quote text-muted mt-6 mb-12" style={{ fontSize: '15px' }}>
          {state.validation}
        </p>

        <a
          href={buildTelUrl('911')}
          className="block text-center py-4 mb-3"
          style={{
            background: '#D89090',
            color: '#F1EDE5',
            borderRadius: '12px',
            textDecoration: 'none',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '1px' }}>Call 911</div>
          <div style={{ fontSize: '11px', opacity: 0.9, marginTop: 2 }}>
            Or the nearest emergency room
          </div>
        </a>

        <a
          href={buildTelUrl('988')}
          className="block text-center py-3 mb-8"
          style={{
            background: 'transparent',
            border: '1px solid #D89090',
            color: '#D89090',
            borderRadius: '12px',
            textDecoration: 'none',
            fontFamily: 'inherit',
          }}
        >
          <div style={{ fontSize: '15px', fontWeight: 500 }}>Call or text 988</div>
          <div style={{ fontSize: '11px', color: '#8E8780', marginTop: 2 }}>
            988 helps with thoughts of harming others, not only self
          </div>
        </a>

        <p className="italic text-muted text-xs leading-relaxed mt-4">
          You&apos;re not in trouble for these thoughts. They&apos;re a signal you need a real
          person, in person, right now. We&apos;ll be here when you get back.
        </p>
      </div>
    </main>
  );
}

function Stabilizing({
  state,
  stepIndex,
  yourPerson,
  onNext,
  onPrev,
  onClose,
}: {
  state: SosState;
  stepIndex: number;
  yourPerson: YourPerson | null;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const step = state.stabilizationSteps[stepIndex];
  const total = state.stabilizationSteps.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;

  return (
    <main className="min-h-screen flex flex-col px-8 py-12">
      <button
        onClick={onClose}
        className="self-end text-2xl mb-2"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#8E8780',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        ✕
      </button>

      {isFirst && (
        <p className="italic-quote mb-6" style={{ fontSize: '17px' }}>
          {state.validation}
        </p>
      )}

      <div className="hairline-short my-6" />

      <div className="kicker-muted mb-4">
        Step {stepIndex + 1} of {total} · {step.duration}
      </div>
      <p
        style={{
          fontSize: '17px',
          fontFamily: 'inherit',
          fontWeight: 400,
          lineHeight: 1.6,
          letterSpacing: '-0.2px',
        }}
      >
        {step.instruction}
      </p>

      <div className="flex gap-1 mt-8">
        {state.stabilizationSteps.map((_, i) => (
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

      {yourPerson && (
        <div
          className="mt-10 p-3 rounded-sm"
          style={{
            background: '#15161E',
            border: '1px solid #1F1F26',
          }}
        >
          <div className="kicker-muted mb-2">Your person</div>
          <div className="flex gap-2">
            <a
              href={buildSmsUrl(yourPerson.phone, YOUR_PERSON_DEFAULT_OPENER)}
              className="flex-1 text-center py-2 text-xs"
              style={{
                background: 'transparent',
                border: '1px solid #D89090',
                color: '#D89090',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Text {yourPerson.name}
            </a>
            <a
              href={buildTelUrl(yourPerson.phone)}
              className="flex-1 text-center py-2 text-xs"
              style={{
                background: 'transparent',
                border: '1px solid #D89090',
                color: '#D89090',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Call
            </a>
          </div>
        </div>
      )}

      <div className="flex-1" />

      <div className="flex justify-between items-center pt-6">
        <button onClick={onPrev} className="action-btn-quiet">
          {isFirst ? 'Different feeling' : 'Back'}
        </button>
        <button onClick={onNext} className="action-btn">
          {isLast ? 'Done' : 'Next'}
        </button>
      </div>
    </main>
  );
}

function Aftermath({
  state,
  yourPerson,
  onOkay,
  onMore,
}: {
  state: SosState;
  yourPerson: YourPerson | null;
  onOkay: () => void;
  onMore: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col px-8 py-16 justify-center">
      <h1 className="display-lg">
        How are you
        <br />
        arriving now?
      </h1>
      <p className="italic-quote text-muted mt-4 mb-12" style={{ fontSize: '14px' }}>
        That was a lot. There&apos;s no right answer here.
      </p>

      <button
        onClick={onOkay}
        className="text-left py-4 w-full"
        style={{
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid #1F1F26',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        <div className="font-serif" style={{ fontSize: '22px', color: '#F1EDE5', fontWeight: 500 }}>
          I&apos;m okay.
        </div>
        <div className="text-muted text-xs mt-1" style={{ letterSpacing: '0.3px' }}>
          The edge is off.
        </div>
      </button>

      <button
        onClick={onMore}
        className="text-left py-4 w-full"
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
        }}
      >
        <div className="font-serif" style={{ fontSize: '22px', color: '#F1EDE5', fontWeight: 500 }}>
          I need more.
        </div>
        <div className="text-muted text-xs mt-1" style={{ letterSpacing: '0.3px' }}>
          Keep going — a skill, some context, or a real person.
        </div>
      </button>

      {state.id === 'harm-self' && (
        <div className="mt-12 pt-6" style={{ borderTop: '1px solid #1F1F26' }}>
          <div className="kicker-muted mb-2">If you&apos;re in crisis</div>
          <a
            href={buildTelUrl('988')}
            className="block text-sm mb-1"
            style={{ color: '#D89090', textDecoration: 'underline' }}
          >
            Call or text 988
          </a>
          {yourPerson && (
            <a
              href={buildSmsUrl(yourPerson.phone, YOUR_PERSON_DEFAULT_OPENER)}
              className="block text-sm"
              style={{ color: '#D89090', textDecoration: 'underline' }}
            >
              Text {yourPerson.name}
            </a>
          )}
        </div>
      )}
    </main>
  );
}

function Branching({
  onSelect,
  onClose,
}: {
  onSelect: (o: SosBranchOption) => void;
  onClose: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col px-8 py-12">
      <button
        onClick={onClose}
        className="self-end text-2xl mb-2"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#8E8780',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        ✕
      </button>

      <h1 className="display">
        What would
        <br />
        help next?
      </h1>
      <p className="italic-quote text-muted mt-3" style={{ fontSize: '14px' }}>
        Or close the app. Both are okay.
      </p>

      <div className="mt-8">
        {SOS_BRANCH_OPTIONS.map((option, i) => {
          const isLast = i === SOS_BRANCH_OPTIONS.length - 1;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className="row-link w-full text-left"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isLast ? 'none' : '1px solid #1F1F26',
                fontFamily: 'inherit',
                fontSize: '17px',
                cursor: 'pointer',
                color: option.comingSoon ? '#8E8780' : '#F1EDE5',
                letterSpacing: '-0.2px',
              }}
            >
              {option.label}
              {option.comingSoon && (
                <span className="row-sub">{option.description} · soon</span>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
