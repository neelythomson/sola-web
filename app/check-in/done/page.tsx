'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { get, STORAGE_KEYS } from '@/lib/storage';
import { getOffer, Offer, CheckinAnswers } from '@/lib/check-in-routing';

export default function CheckInDonePage() {
  const router = useRouter();
  const [offer, setOffer] = useState<Offer | null>(null);

  useEffect(() => {
    // Read the latest check-in from localStorage
    const checkins = get<{ date: string; answers: CheckinAnswers }[]>(
      STORAGE_KEYS.checkins,
      []
    );
    if (checkins.length === 0) {
      // No check-in to interpret — go home
      router.replace('/home');
      return;
    }
    const latest = checkins[checkins.length - 1];
    setOffer(getOffer(latest.answers));
  }, [router]);

  if (!offer) return null;

  return (
    <main className="min-h-screen flex flex-col px-8 py-16 justify-center">
      <div className="eyebrow mb-3" style={{ color: '#8E8780' }}>
        How you&apos;re arriving
      </div>

      <p
        className="italic-quote"
        style={{ fontSize: '22px', lineHeight: 1.4, color: '#F1EDE5', marginBottom: 56 }}
      >
        {offer.validation}
      </p>

      <div className="hairline-short mb-8" />

      <button
        onClick={() => router.push(offer.offerHref)}
        className="text-left w-full"
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'inherit',
          padding: '14px 0',
          borderBottom: '1px solid #1F1F26',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: '22px',
            color: '#F1EDE5',
            fontWeight: 500,
            letterSpacing: '-0.3px',
          }}
        >
          {offer.offerLabel}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#8E8780',
            marginTop: 4,
            fontStyle: 'italic',
            letterSpacing: '0.3px',
          }}
        >
          {offer.offerDescription}
        </div>
      </button>

      <button
        onClick={() => router.push('/home')}
        className="text-left w-full"
        style={{
          background: 'transparent',
          border: 'none',
          fontFamily: 'inherit',
          padding: '14px 0',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            fontFamily: "'EB Garamond', Georgia, serif",
            fontSize: '18px',
            fontStyle: 'italic',
            color: '#8E8780',
            fontWeight: 400,
          }}
        >
          Or just rest. That counts too.
        </div>
      </button>

      <div className="flex-1" />
    </main>
  );
}
