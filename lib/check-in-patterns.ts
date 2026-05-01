/**
 * Pattern detection over check-in history.
 *
 * Returns at most ONE observation per call — no overwhelming. Observations
 * are non-prescriptive ("you've been low-energy three days running") rather
 * than diagnostic ("you might be depressed"). Validation, not analysis.
 *
 * Requires at least 3 check-ins before any pattern surfaces. Earlier than
 * that and we'd be reading tea leaves.
 */

import { CheckinAnswers } from './check-in-routing';

export type CheckinEntry = {
  date: string; // ISO timestamp
  answers: CheckinAnswers;
};

export type Pattern = {
  label: string;       // small uppercase kicker
  observation: string; // the line to show
  tone: 'tender' | 'steady' | 'gold';
};

const SCORE_MAP: Record<keyof CheckinAnswers, Record<string, number>> = {
  energy: { Empty: -2, 'Low but here': -1, Steady: 0, Charged: 1, Wired: 2 },
  emotional: { Numb: -2, Heavy: -1, Steady: 0, Tender: 1, Loud: 2 },
  sensory: { Muffled: -2, 'A little loud': -1, 'Just right': 0, Sharp: 1, 'Too much': 2 },
  focus: { Scattered: -2, Foggy: -1, Steady: 0, 'Lit up': 1, Hyperfixated: 2 },
  capacity: { Empty: -2, Cushion: -1, Steady: 0, Stretching: 1, Overflowing: 2 },
};

function score(entry: CheckinEntry, dim: keyof CheckinAnswers): number {
  const answer = entry.answers[dim];
  if (!answer) return 0;
  return SCORE_MAP[dim]?.[answer] ?? 0;
}

export function detectPattern(checkins: CheckinEntry[]): Pattern | null {
  if (!checkins || checkins.length < 3) return null;

  // Sort by date ascending so "last N" is most recent
  const sorted = [...checkins].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const recent3 = sorted.slice(-3);
  const recent5 = sorted.slice(-5);
  const recent7 = sorted.slice(-7);

  // === Tender patterns (priority — these matter most) ===

  // Low energy run (3+ days)
  if (recent3.every((e) => score(e, 'energy') <= -1)) {
    return {
      label: 'A pattern, gently',
      observation:
        "You've been low-energy three days running. That's a thing your body is saying — not a thing you need to fix today.",
      tone: 'tender',
    };
  }

  // Heavy emotional run (3+ days)
  if (recent3.every((e) => score(e, 'emotional') <= -1)) {
    return {
      label: 'A pattern, gently',
      observation:
        "Heavy or numb emotions for three check-ins now. You're allowed to make today smaller.",
      tone: 'tender',
    };
  }

  // High sensory week (5 of last 7)
  if (recent7.length >= 5) {
    const highSensoryCount = recent7.filter((e) => score(e, 'sensory') >= 1).length;
    if (highSensoryCount >= Math.ceil(recent7.length * 0.7)) {
      return {
        label: 'A pattern, gently',
        observation:
          "Sensory load has been high most of this week. You're allowed to make the world smaller.",
        tone: 'tender',
      };
    }
  }

  // Empty capacity run (3+ days)
  if (recent3.every((e) => score(e, 'capacity') <= -1)) {
    return {
      label: 'A pattern, gently',
      observation:
        "Capacity has been low for three check-ins. The next thing you say no to is a kindness.",
      tone: 'tender',
    };
  }

  // === Gold patterns (rare positive observations — earned) ===

  // Steady run (5+ check-ins all near zero across all dims)
  if (recent5.length >= 5) {
    const allSteady = recent5.every((e) => {
      const total =
        Math.abs(score(e, 'energy')) +
        Math.abs(score(e, 'emotional')) +
        Math.abs(score(e, 'sensory')) +
        Math.abs(score(e, 'capacity'));
      return total <= 2;
    });
    if (allSteady) {
      return {
        label: 'A pattern, gently',
        observation: "Five steady check-ins. Whatever you're doing, it's working.",
        tone: 'gold',
      };
    }
  }

  // === Steady (informational) ===

  // Just showing up — 7+ check-ins total
  if (sorted.length === 7) {
    return {
      label: 'Seven check-ins',
      observation: "A week of showing up. The skill is the showing up.",
      tone: 'steady',
    };
  }
  if (sorted.length === 30) {
    return {
      label: 'A month',
      observation: "Thirty check-ins. You're building a sky.",
      tone: 'gold',
    };
  }

  return null;
}
