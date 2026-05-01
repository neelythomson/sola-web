'use client';

import TabBar from '@/components/TabBar';

const TOOLKIT_GROUPS = [
  {
    label: "When you're flooded",
    sub: 'TIPP, self-soothe, paced breathing',
  },
  {
    label: "When you've gone quiet",
    sub: 'Gentle movement, naming, return',
  },
  {
    label: 'When the world is too loud',
    sub: 'Reduce input, anchor, slow',
  },
  {
    label: "When thoughts won't stop",
    sub: 'Defusion, grounding, motion',
  },
  {
    label: "When you can't start",
    sub: 'Body before brain, smallest step',
  },
  {
    label: 'Values, slowly',
    sub: 'ACT for who you&apos;re becoming',
  },
];

export default function ToolkitPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 px-8 py-12">
        <h1 className="display">Toolkit</h1>
        <p className="italic-quote text-muted mt-3" style={{ fontSize: '14px' }}>
          Skills, slowly learned. Practice when calm so they&apos;re there when it counts.
        </p>

        <div className="mt-8">
          {TOOLKIT_GROUPS.map((group, i) => {
            const isLast = i === TOOLKIT_GROUPS.length - 1;
            return (
              <button
                key={group.label}
                onClick={() => alert(`"${group.label}" — content coming soon.`)}
                className="row-link w-full text-left"
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isLast ? 'none' : '1px solid #1F1F26',
                  fontFamily: 'inherit',
                  fontSize: '17px',
                  cursor: 'pointer',
                  color: '#F1EDE5',
                  letterSpacing: '-0.2px',
                  padding: '14px 0',
                }}
              >
                {group.label}
                <span className="row-sub" dangerouslySetInnerHTML={{ __html: group.sub }} />
              </button>
            );
          })}
        </div>
      </main>
      <TabBar />
    </div>
  );
}
