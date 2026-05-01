'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { setYourPerson } from '@/lib/storage';

export default function YourPersonPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');

  const isValid = name.trim().length > 0 && phone.replace(/\D/g, '').length >= 7;

  const handleSave = () => {
    if (!isValid) return;
    setYourPerson({
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship.trim() || undefined,
    });
    router.push('/home');
  };

  const handleSkip = () => {
    router.push('/home');
  };

  return (
    <main className="min-h-screen flex flex-col px-8 py-12">
      <div className="eyebrow">One last thing</div>
      <h1 className="display mt-3">
        Who&apos;s
        <br />
        your person?
      </h1>
      <p className="italic-quote text-muted mt-4" style={{ fontSize: '14px' }}>
        Someone you&apos;d want next to you on a hard night. We&apos;ll never send for you. We open
        your messages — you decide what to send.
      </p>

      <div className="mt-8">
        <div className="mb-6 pb-2" style={{ borderBottom: '1px solid #1F1F26' }}>
          <div className="kicker-muted mb-2">Their name</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sam"
            autoCapitalize="words"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F1EDE5',
              fontFamily: 'inherit',
              fontStyle: 'italic',
              fontSize: '19px',
              width: '100%',
              padding: '4px 0',
            }}
          />
        </div>

        <div className="mb-6 pb-2" style={{ borderBottom: '1px solid #1F1F26' }}>
          <div className="kicker-muted mb-2">Their number</div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. (555) 123-4567"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F1EDE5',
              fontFamily: 'inherit',
              fontStyle: 'italic',
              fontSize: '19px',
              width: '100%',
              padding: '4px 0',
            }}
          />
        </div>

        <div className="mb-6 pb-2" style={{ borderBottom: '1px solid #1F1F26' }}>
          <div className="kicker-muted mb-2">Relationship (optional)</div>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="e.g. partner, sister, best friend"
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F1EDE5',
              fontFamily: 'inherit',
              fontStyle: 'italic',
              fontSize: '19px',
              width: '100%',
              padding: '4px 0',
            }}
          />
        </div>
      </div>

      <div className="flex-1" />
      <div className="flex justify-between items-center pt-4">
        <button onClick={handleSkip} className="action-btn-quiet">
          Skip for now
        </button>
        <button
          onClick={handleSave}
          disabled={!isValid}
          className="action-btn"
        >
          Save
        </button>
      </div>
    </main>
  );
}
