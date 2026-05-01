'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  detectAbandonedSession,
  shouldShowMorningAfter,
  dismissMorningAfter,
  completeSosSession,
  SosInProgress,
} from '@/lib/storage';
import TabBar from '@/components/TabBar';

export default function HomePage() {
  const [greeting, setGreeting] = useState('Good morning');
  const [abandoned, setAbandoned] = useState<SosInProgress | null>(null);
  const [morningAfter, setMorningAfter] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    setAbandoned(detectAbandonedSession());
    setMorningAfter(shouldShowMorningAfter());
  }, []);

  const handleStartFresh = () => {
    completeSosSession();
    setAbandoned(null);
  };

  const handleDismissMorning = () => {
    dismissMorningAfter();
    setMorningAfter(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-8 py-12">
        <div className="italic text-muted text-sm mb-1">{greeting}</div>
        <h1 className="display">
          How are you
          <br />
          arriving today?
        </h1>

        {abandoned && (
          <div
            className="mt-12 p-5 rounded-sm"
            style={{ background: '#1F1518', borderLeft: '2px solid #D7BD8E' }}
          >
            <div
              className="text-xs uppercase mb-2"
              style={{ color: '#D7BD8E', letterSpacing: '2.5px', fontWeight: 500 }}
            >
              We were in the middle of something
            </div>
            <p className="italic-quote text-text mb-4" style={{ fontSize: '14px' }}>
              No need to explain. You can come back to where you were, or start fresh — both are
              okay.
            </p>
            <div className="flex gap-3">
              <Link
                href="/sos"
                className="flex-1 text-center py-2 px-3 text-xs"
                style={{
                  background: '#D89090',
                  color: '#F1EDE5',
                  borderRadius: '6px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}
              >
                Come back
              </Link>
              <button
                onClick={handleStartFresh}
                className="flex-1 text-center py-2 px-3 text-xs"
                style={{
                  background: 'transparent',
                  color: '#8E8780',
                  border: '1px solid #1F1F26',
                  borderRadius: '6px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontFamily: 'inherit',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Start fresh
              </button>
            </div>
          </div>
        )}

        {!abandoned && morningAfter && (
          <div
            className="mt-12 p-5 rounded-sm"
            style={{ background: '#15161E', borderLeft: '2px solid #9BAEC2' }}
          >
            <div
              className="text-xs uppercase mb-2"
              style={{ color: '#9BAEC2', letterSpacing: '2.5px', fontWeight: 500 }}
            >
              Thinking of you
            </div>
            <p className="italic-quote text-text mb-3" style={{ fontSize: '14px' }}>
              Yesterday was a lot. How are you arriving today? When you&apos;re ready, your
              check-in is below.
            </p>
            <button
              onClick={handleDismissMorning}
              className="text-xs underline italic"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8E8780',
                cursor: 'pointer',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              Got it — thanks for noticing
            </button>
          </div>
        )}

        {!abandoned && (
          <div className="mt-16">
            <Link href="/check-in" className="row-link">
              Today&apos;s check-in
              <span className="row-sub">Five small questions</span>
            </Link>
            <Link href="/toolkit" className="row-link">
              Open the toolkit
              <span className="row-sub">Skills, slowly learned</span>
            </Link>
            <Link href="/sky" className="row-link last">
              Your sky
              <span className="row-sub">A constellation, slowly</span>
            </Link>
          </div>
        )}

        <div className="flex-1" />
      </main>
      <TabBar />
    </div>
  );
}
