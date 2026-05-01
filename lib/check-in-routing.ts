/**
 * Check-in routing — turn 5 answers into one offered next step.
 *
 * Strategy:
 *   1. Each dimension's options score -2..+2 from depleted/quiet to amped/loud.
 *   2. The dimension with the highest absolute score wins ("most acute").
 *   3. Tiebreak: emotional > sensory > energy > capacity > focus
 *      (clinical instinct — emotional state is usually the most load-bearing).
 *   4. Map the (dimension, direction) pair to a single offer with a Co-Star-y
 *      validation line and one next step.
 *
 * Validation always leads. Co-Star principle — meet them where they are
 * before suggesting anything. The offer is one tap; "rest counts" is always
 * the alternative below.
 */

export type CheckinAnswers = {
  energy?: string;
  emotional?: string;
  sensory?: string;
  focus?: string;
  capacity?: string;
};

export type Offer = {
  validation: string;
  offerLabel: string;
  offerDescription: string;
  /** Where the offer routes. /care/* for in-app interventions, /sos for crisis-grade. */
  offerHref: string;
  /** Identifier for the strongest dimension — used for analytics + pattern detection. */
  strongestDimension: 'energy' | 'emotional' | 'sensory' | 'focus' | 'capacity' | 'steady';
};

const SCORE_MAP: Record<string, Record<string, number>> = {
  energy: { Empty: -2, 'Low but here': -1, Steady: 0, Charged: 1, Wired: 2 },
  emotional: { Numb: -2, Heavy: -1, Steady: 0, Tender: 1, Loud: 2 },
  sensory: { Muffled: -2, 'A little loud': -1, 'Just right': 0, Sharp: 1, 'Too much': 2 },
  focus: { Scattered: -2, Foggy: -1, Steady: 0, 'Lit up': 1, Hyperfixated: 2 },
  capacity: { Empty: -2, Cushion: -1, Steady: 0, Stretching: 1, Overflowing: 2 },
};

const TIEBREAK_ORDER: Array<keyof CheckinAnswers> = [
  'emotional',
  'sensory',
  'energy',
  'capacity',
  'focus',
];

export function getOffer(answers: CheckinAnswers): Offer {
  // Compute scores
  const scores = TIEBREAK_ORDER.map((dim) => {
    const answer = answers[dim];
    const raw = answer && SCORE_MAP[dim]?.[answer];
    const score = typeof raw === 'number' ? raw : 0;
    return { dim, score, abs: Math.abs(score) };
  });

  // Find max absolute (tiebreak by TIEBREAK_ORDER which scores are already in)
  const acute = scores.reduce((best, s) => (s.abs > best.abs ? s : best), scores[0]);

  // If everything is steady (all 0s), return the maintenance offer
  if (acute.abs === 0) {
    return {
      validation: 'You\'re arriving steady.',
      offerLabel: 'Plant a seed',
      offerDescription: 'A small thing for the version of you who comes home tonight.',
      offerHref: '/care/values',
      strongestDimension: 'steady',
    };
  }

  // Map (dimension, direction) → offer
  return MAP_TO_OFFER(acute.dim, acute.score);
}

function MAP_TO_OFFER(dim: keyof CheckinAnswers, score: number): Offer {
  const dir: 'down' | 'up' = score < 0 ? 'down' : 'up';
  const strong: 'mild' | 'strong' = Math.abs(score) === 2 ? 'strong' : 'mild';

  if (dim === 'emotional') {
    if (dir === 'down' && strong === 'strong') {
      return {
        validation: 'Numb is protective. Your nervous system has gone quiet.',
        offerLabel: 'A small return',
        offerDescription: 'Five things you can see, four you can touch.',
        offerHref: '/care/grounding',
        strongestDimension: 'emotional',
      };
    }
    if (dir === 'down' && strong === 'mild') {
      return {
        validation: 'Heavy is real today.',
        offerLabel: 'Sit with it',
        offerDescription: 'Three minutes of holding what\'s here. No fixing.',
        offerHref: '/care/sit-with-it',
        strongestDimension: 'emotional',
      };
    }
    if (dir === 'up' && strong === 'strong') {
      return {
        validation: 'Big feelings are here.',
        offerLabel: 'A skill that meets the size',
        offerDescription: 'Distress tolerance — adapted for ND brains.',
        offerHref: '/sos?state=emotional-flooding',
        strongestDimension: 'emotional',
      };
    }
    if (dir === 'up' && strong === 'mild') {
      return {
        validation: 'You\'re tender today.',
        offerLabel: 'A breath',
        offerDescription: 'One minute. Slow exhale. Self-compassion.',
        offerHref: '/care/breath',
        strongestDimension: 'emotional',
      };
    }
  }

  if (dim === 'sensory') {
    if (dir === 'up' && strong === 'strong') {
      return {
        validation: 'The world is too loud.',
        offerLabel: 'Reduce the input',
        offerDescription: 'The full SOS sensory flow. Walk you through it.',
        offerHref: '/sos?state=sensory-overwhelm',
        strongestDimension: 'sensory',
      };
    }
    if (dir === 'up' && strong === 'mild') {
      return {
        validation: 'The volume is up.',
        offerLabel: 'Soften it',
        offerDescription: 'Slow your breath, dim the lights if you can.',
        offerHref: '/care/breath',
        strongestDimension: 'sensory',
      };
    }
    if (dir === 'down') {
      return {
        validation: 'Things feel muffled.',
        offerLabel: 'A small return',
        offerDescription: 'Wake the senses gently — five things you can see.',
        offerHref: '/care/grounding',
        strongestDimension: 'sensory',
      };
    }
  }

  if (dim === 'energy') {
    if (dir === 'down' && strong === 'strong') {
      return {
        validation: 'You\'re at the bottom of the tank.',
        offerLabel: 'Permission to do less',
        offerDescription: 'One micro-action, or just rest. Both count.',
        offerHref: '/care/permission',
        strongestDimension: 'energy',
      };
    }
    if (dir === 'down' && strong === 'mild') {
      return {
        validation: 'Low, but here.',
        offerLabel: 'A tiny anchor',
        offerDescription: 'Sixty seconds of grounding. Nothing more.',
        offerHref: '/care/grounding',
        strongestDimension: 'energy',
      };
    }
    if (dir === 'up' && strong === 'strong') {
      return {
        validation: 'Your nervous system is loud.',
        offerLabel: 'Settle for a minute',
        offerDescription: 'Sixty seconds of paced breathing. The exhale is the work.',
        offerHref: '/care/breath',
        strongestDimension: 'energy',
      };
    }
    if (dir === 'up' && strong === 'mild') {
      return {
        validation: 'There\'s charge here.',
        offerLabel: 'Channel it',
        offerDescription: 'Pick one small thing to put it toward.',
        offerHref: '/care/one-thing',
        strongestDimension: 'energy',
      };
    }
  }

  if (dim === 'focus') {
    if (dir === 'down' && strong === 'strong') {
      return {
        validation: 'Your attention is everywhere.',
        offerLabel: 'Pick one thing',
        offerDescription: 'We can pick it together. Just one.',
        offerHref: '/care/one-thing',
        strongestDimension: 'focus',
      };
    }
    if (dir === 'down' && strong === 'mild') {
      return {
        validation: 'It\'s a foggy day in there.',
        offerLabel: 'Body before brain',
        offerDescription: 'A breath. Then we\'ll see.',
        offerHref: '/care/breath',
        strongestDimension: 'focus',
      };
    }
    if (dir === 'up' && strong === 'strong') {
      return {
        validation: 'You\'re locked in.',
        offerLabel: 'A check-in with the rest of you',
        offerDescription: 'Notice the rest of your body and the room.',
        offerHref: '/care/grounding',
        strongestDimension: 'focus',
      };
    }
    if (dir === 'up' && strong === 'mild') {
      return {
        validation: 'You\'re lit up.',
        offerLabel: 'Set a soft edge',
        offerDescription: 'Pick the one thing this energy goes toward.',
        offerHref: '/care/one-thing',
        strongestDimension: 'focus',
      };
    }
  }

  if (dim === 'capacity') {
    if (dir === 'down' && strong === 'strong') {
      return {
        validation: 'You\'re empty.',
        offerLabel: 'Today is for less',
        offerDescription: 'You don\'t owe anyone more today.',
        offerHref: '/care/permission',
        strongestDimension: 'capacity',
      };
    }
    if (dir === 'down' && strong === 'mild') {
      return {
        validation: 'There\'s a small cushion.',
        offerLabel: 'One small thing',
        offerDescription: 'Doable, not ambitious.',
        offerHref: '/care/one-thing',
        strongestDimension: 'capacity',
      };
    }
    if (dir === 'up' && strong === 'strong') {
      return {
        validation: 'You\'re holding too much.',
        offerLabel: 'Set one thing down',
        offerDescription: 'What can wait until tomorrow?',
        offerHref: '/care/permission',
        strongestDimension: 'capacity',
      };
    }
    if (dir === 'up' && strong === 'mild') {
      return {
        validation: 'You\'re stretching.',
        offerLabel: 'A breath at the edge',
        offerDescription: 'Notice the stretch. Decide.',
        offerHref: '/care/breath',
        strongestDimension: 'capacity',
      };
    }
  }

  // Fallback (should never hit)
  return {
    validation: 'You showed up.',
    offerLabel: 'Plant a seed',
    offerDescription: 'A small thing for later.',
    offerHref: '/care/values',
    strongestDimension: 'steady',
  };
}
