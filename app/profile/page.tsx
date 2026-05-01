'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getYourPerson, YourPerson, remove, STORAGE_KEYS } from '@/lib/storage';
import TabBar from '@/components/TabBar';

export default function ProfilePage() {
  const router = useRouter();
  const [yourPerson, setYourPersonState] = useState<YourPerson | null>(null);

  useEffect(() => {
    setYourPersonState(getYourPerson());
  }, []);

  const handleResetData = () => {
    if (confirm('Clear all SOLA data on this device? This will reset onboarding.')) {
      Object.values(STORAGE_KEYS).forEach((key) => remove(key));
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-8 py-12">
        <h1 className="display" style={{ fontStyle: 'italic', fontSize: '28px' }}>
          You
        </h1>

        <div className="mt-8">
          <div className="kicker-muted mb-3">About SOLA</div>
          <p className="italic-quote" style={{ fontSize: '14px', lineHeight: 1.55 }}>
            A therapeutic toolkit for people whose brains work differently. Designed by Leah
            Hunter, MA. Built by Neely Thomson.
          </p>
          <p className="text-muted mt-2" style={{ fontSize: '11px', letterSpacing: '0.3px' }}>
            A Generational Healing Co project.
          </p>
        </div>

        <div className="hairline my-8" />

        <button
          onClick={() => router.push('/onboarding/your-person')}
          className="row-link w-full text-left"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #1F1F26',
            fontFamily: 'inherit',
            fontSize: '17px',
            cursor: 'pointer',
            color: '#F1EDE5',
            padding: '14px 0',
          }}
        >
          Your person
          <span className="row-sub">
            {yourPerson ? `${yourPerson.name} · ${yourPerson.phone}` : 'Not set yet — tap to add'}
          </span>
        </button>

        <button
          onClick={() => router.push('/sky')}
          className="row-link w-full text-left"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #1F1F26',
            fontFamily: 'inherit',
            fontSize: '17px',
            cursor: 'pointer',
            color: '#F1EDE5',
            padding: '14px 0',
          }}
        >
          Your sky
        </button>

        <a
          href="tel:988"
          className="row-link w-full text-left block"
          style={{
            borderBottom: '1px solid #1F1F26',
            fontSize: '17px',
            color: '#F1EDE5',
            padding: '14px 0',
            textDecoration: 'none',
          }}
        >
          Crisis resources
          <span className="row-sub">988 · Crisis Text Line · 911</span>
        </a>

        <button
          onClick={handleResetData}
          className="row-link w-full text-left"
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: 'none',
            fontFamily: 'inherit',
            fontSize: '15px',
            fontStyle: 'italic',
            cursor: 'pointer',
            color: '#8E8780',
            padding: '14px 0',
          }}
        >
          Clear all data
          <span className="row-sub">Resets onboarding · for testing only</span>
        </button>

        <div className="flex-1" />

        <div className="text-center italic text-muted mt-8" style={{ fontSize: '11px' }}>
          SOLA v0.1 · web preview
          <br />
          Built with care in Nashville
        </div>
      </main>
      <TabBar />
    </div>
  );
}
