'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/home', label: 'Home' },
  { href: '/check-in', label: 'Check in' },
  { href: '/sos', label: 'SOS' },
  { href: '/sky', label: 'Sky' },
  { href: '/profile', label: 'You' },
];

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 px-4 py-4"
      style={{
        background: '#0A0A0F',
        borderTop: '1px solid #1F1F26',
      }}
    >
      <div className="flex justify-between items-center">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="text-xs"
              style={{
                color: isActive ? '#D7BD8E' : '#8E8780',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 400,
                textDecoration: 'none',
                fontFamily: 'inherit',
                padding: '4px 6px',
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
