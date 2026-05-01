'use client';

import Link from 'next/link';

export default function WelcomePage() {
  return (
    <main className="min-h-screen flex flex-col px-8 py-16">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Arc + sparkle motif */}
        <svg width="80" height="44" viewBox="0 0 80 44" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="arc-grad" x1="0" y1="0" x2="80" y2="0">
              <stop offset="0" stopColor="#D89090" />
              <stop offset="0.5" stopColor="#8B86A2" />
              <stop offset="1" stopColor="#9BAEC2" />
            </linearGradient>
          </defs>
          <path
            d="M8 36 Q 40 4 72 36"
            stroke="url(#arc-grad)"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
          <path d="M58 30 L60 26 L62 30 L66 32 L62 34 L60 38 L58 34 L54 32 Z" fill="#D7BD8E" />
        </svg>

        <div className="mt-8" />

        <h1
          className="text-text"
          style={{
            fontSize: '48px',
            fontWeight: 400,
            letterSpacing: '12px',
            lineHeight: 1,
          }}
        >
          SOLA
        </h1>
        <div className="hairline-short my-3" />
        <div className="eyebrow">A softer place to land</div>

        <div className="mt-16 max-w-[280px]">
          <p className="italic-quote">
            Your brain isn&apos;t broken.
            <br />
            Your tools were.
          </p>
        </div>
      </div>

      <div className="text-center pb-4">
        <Link href="/onboarding/identities" className="action-btn">
          Begin
        </Link>
        <div
          className="mt-5 italic text-muted"
          style={{ fontSize: '11px' }}
        >
          Built by Leah Hunter, MA
        </div>
      </div>
    </main>
  );
}
