/**
 * localStorage wrappers — safe on SSR.
 *
 * All state is local-only. No backend (yet). Browser-scoped only.
 * If you clear localStorage you reset the app entirely.
 */

const isBrowser = typeof window !== 'undefined';

export const STORAGE_KEYS = {
  hasOnboarded: 'sola.hasOnboarded',
  identities: 'sola.identities',
  yourPerson: 'sola.yourPerson',
  sosInProgress: 'sola.sosInProgress',
  sosLastSession: 'sola.sosLastSession',
  checkins: 'sola.checkins',
  lastCheckinDate: 'sola.lastCheckinDate',
  skyStars: 'sola.skyStars',
} as const;

export function get<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function set<T>(key: string, value: T): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota or private mode — silent */
  }
}

export function remove(key: string): void {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}

/* === Your Person === */

export type YourPerson = {
  name: string;
  phone: string;
  relationship?: string;
};

export function getYourPerson(): YourPerson | null {
  return get<YourPerson | null>(STORAGE_KEYS.yourPerson, null);
}

export function setYourPerson(person: YourPerson | null): void {
  if (person === null) {
    remove(STORAGE_KEYS.yourPerson);
    return;
  }
  set(STORAGE_KEYS.yourPerson, person);
}

export const YOUR_PERSON_DEFAULT_OPENER =
  "Hi — I'm using SOLA and it suggested reaching out. I'm not okay right now. Can you talk for a few minutes?";

/* === SOS session (soft-return + morning-after) === */

export type SosStage = 'stabilizing' | 'aftermath' | 'branching' | 'completed';

export type SosInProgress = {
  stateId: string;
  stage: SosStage;
  stepIndex: number;
  startedAt: string;
  updatedAt: string;
};

const ABANDONMENT_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
const MORNING_AFTER_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const MORNING_AFTER_MIN_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

export function startSosSession(stateId: string): void {
  const now = new Date().toISOString();
  set<SosInProgress>(STORAGE_KEYS.sosInProgress, {
    stateId,
    stage: 'stabilizing',
    stepIndex: 0,
    startedAt: now,
    updatedAt: now,
  });
}

export function updateSosSession(patch: Partial<Omit<SosInProgress, 'startedAt'>>): void {
  const existing = get<SosInProgress | null>(STORAGE_KEYS.sosInProgress, null);
  if (!existing) return;
  set<SosInProgress>(STORAGE_KEYS.sosInProgress, {
    ...existing,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export function completeSosSession(): void {
  set(STORAGE_KEYS.sosLastSession, new Date().toISOString());
  remove(STORAGE_KEYS.sosInProgress);
}

export function getSosInProgress(): SosInProgress | null {
  return get<SosInProgress | null>(STORAGE_KEYS.sosInProgress, null);
}

export function detectAbandonedSession(): SosInProgress | null {
  const session = getSosInProgress();
  if (!session) return null;
  const age = Date.now() - new Date(session.updatedAt).getTime();
  return age >= ABANDONMENT_THRESHOLD_MS ? session : null;
}

export function shouldShowMorningAfter(): boolean {
  const last = get<string | null>(STORAGE_KEYS.sosLastSession, null);
  if (!last) return false;
  const age = Date.now() - new Date(last).getTime();
  return age >= MORNING_AFTER_MIN_AGE_MS && age <= MORNING_AFTER_WINDOW_MS;
}

export function dismissMorningAfter(): void {
  remove(STORAGE_KEYS.sosLastSession);
}

/* === Sky stars (constellation reward) === */

export type SkyStar = {
  id: string;
  category: 'checkin' | 'sos' | 'skill' | 'reflection';
  earnedAt: string;
  color: string;
};

export function getSkyStars(): SkyStar[] {
  return get<SkyStar[]>(STORAGE_KEYS.skyStars, []);
}

export function addSkyStar(category: SkyStar['category']): void {
  const stars = getSkyStars();
  const colors = {
    checkin: '#9BAEC2',
    sos: '#D89090',
    skill: '#D7BD8E',
    reflection: '#8B86A2',
  };
  stars.push({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    category,
    earnedAt: new Date().toISOString(),
    color: colors[category],
  });
  set(STORAGE_KEYS.skyStars, stars);
}

/* === Phone-link helpers (Your Person) === */

export function buildSmsUrl(phone: string, message: string): string {
  const cleaned = phone.replace(/[^+0-9]/g, '');
  // iOS uses & for body, Android uses ? — use ?, broadly supported on web
  return `sms:${cleaned}?body=${encodeURIComponent(message)}`;
}

export function buildTelUrl(phone: string): string {
  return `tel:${phone.replace(/[^+0-9]/g, '')}`;
}
