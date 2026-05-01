/**
 * SOS Crisis States — ported from the React Native codebase.
 *
 * Two-stage flow per Leah's voice note:
 *   Stage 1 — `stabilizationSteps` — reactive coping in the moment.
 *   Stage 2 — branching options (see SOS_BRANCH_OPTIONS).
 *
 * Routing:
 *   'in-app' — runs the full stabilize → aftermath → branch flow.
 *   'out-of-app-immediate' — short-circuits to ER/911/988 with no in-app skills.
 */

export type SosRouting = 'in-app' | 'out-of-app-immediate';

export type SosState = {
  id: string;
  label: string;
  description: string;
  routing: SosRouting;
  validation: string;
  stabilizationSteps: { instruction: string; duration: string }[];
  escalation: string;
};

export const SOS_STATES: SosState[] = [
  {
    id: 'emotional-flooding',
    label: "Everything's too much",
    description: 'For when feelings are too big to hold',
    routing: 'in-app',
    validation:
      "Your emotions are real. They're big. That's not wrong. Right now, your nervous system is in overdrive. These steps will help it downshift.",
    stabilizationSteps: [
      {
        instruction:
          'Splash cold water on your face or hold ice to your wrist. Your body will register "survival moment" and your heart rate will slow. Stay with the cold for 30 seconds.',
        duration: '30 sec',
      },
      {
        instruction:
          'Move. Jump, run, do whatever feels intense. Your body is flooded with stress hormones. Burn them off. 60 seconds of hard movement.',
        duration: '60 sec',
      },
      {
        instruction:
          "Slow your breath. In for 4, hold for 4, out for 6. The longer exhale activates your calm system. Do this 5 times. You're not trying to stop feeling — you're asking your nervous system to slow down.",
        duration: '90 sec',
      },
      {
        instruction:
          "Find one thing to hold. Ice, a texture you love, a cold cup. Let the physical sensation anchor you. This is called self-soothing. You're telling your body: we're safe enough to be here.",
        duration: '90 sec',
      },
    ],
    escalation:
      "If the intensity doesn't start to shift, reach out to someone you trust or contact 988. There's no hierarchy of crisis. If you need support, you deserve it.",
  },
  {
    id: 'shutdown',
    label: "I've gone quiet",
    description: 'For when you feel frozen, numb, or far away',
    routing: 'in-app',
    validation:
      "Shutdown is a nervous system response. You didn't choose it. You're not broken. Your system is protecting you by going quiet. This is temporary.",
    stabilizationSteps: [
      {
        instruction:
          "Notice where you are. Look around. Name 3 things you see. Don't judge them — just notice them. This orients your nervous system to the present, which the shutdown state has disconnected you from.",
        duration: '60 sec',
      },
      {
        instruction:
          'Move gently. Not exercise — just tiny movement. Wiggle your fingers, stretch your arms, shift your weight. Movement tells your nervous system "we\'re safe and capable." Stillness feeds the shutdown.',
        duration: '60 sec',
      },
      {
        instruction:
          "One small sensation. Hold ice. Feel a texture. Taste ice water. Something that wakes up your sensory system without overwhelming it. Shutdown dims sensation — you're turning the volume back up.",
        duration: '60 sec',
      },
      {
        instruction:
          "If you can, stand or walk. The change in position signals your nervous system that you're not in imminent danger. You don't have to go anywhere. Just move.",
        duration: '90 sec',
      },
    ],
    escalation:
      'If you remain frozen after these steps, reach out. Shutdown can be a sign your nervous system needs deeper support.',
  },
  {
    id: 'sensory-overwhelm',
    label: 'Too much input',
    description: 'Sound, light, texture — all of it, all at once',
    routing: 'in-app',
    validation:
      "The input IS too much. You're not being dramatic. Your nervous system is built to be more sensitive to sensory input. Right now, you're in protection mode. Let's reduce the input.",
    stabilizationSteps: [
      {
        instruction:
          "Reduce input immediately. If possible, go somewhere quieter, darker, fewer people. If you can't move, cover your ears, close your eyes, step into a corner. You're signaling to your nervous system: we're removing the threat.",
        duration: '90 sec',
      },
      {
        instruction:
          'Find one neutral anchor. One texture, sound, or sight that feels neutral or slightly calming (not adding more input). Hold it. Focus on it.',
        duration: '90 sec',
      },
      {
        instruction: 'Slow everything down. Slow breathing, slow movement, slow blinks. Speed triggers more arousal. Slowing signals safety.',
        duration: '90 sec',
      },
      {
        instruction:
          'If you can, dim lights, reduce volume, or move to a cooler space. Temperature, darkness, and quiet are nervous system resets.',
        duration: '90 sec',
      },
    ],
    escalation:
      'If you remain overwhelmed, reach out. Sometimes sensory input builds and you need help shifting it.',
  },
  {
    id: 'anxiety-spiral',
    label: "My thoughts won't stop",
    description: 'For racing, looping, catastrophizing',
    routing: 'in-app',
    validation:
      "Your thoughts are loud right now. That doesn't make them true. Anxiety is very convincing. It's also temporary. These steps will interrupt the spiral.",
    stabilizationSteps: [
      {
        instruction:
          'Name what you\'re spiraling about. Out loud or write it. "I\'m spiraling about failing, about disappointing people, about being alone." Naming it interrupts the automaticity.',
        duration: '60 sec',
      },
      {
        instruction:
          'Ground through senses: 5 things you see, 4 things you feel/touch, 3 things you hear, 2 you smell, 1 you taste. Spiral lives in your head. Your senses live right now. The senses win.',
        duration: '2 min',
      },
      {
        instruction:
          'Notice the thought instead of being the thought. "I\'m having the thought that something bad will happen." Not "something bad will happen." The difference is freedom.',
        duration: '90 sec',
      },
      {
        instruction:
          'Move. Walk, shake out your body, anything that breaks the mental loop. Physical motion is the interrupt. Anxiety lives in stagnation.',
        duration: '90 sec',
      },
    ],
    escalation:
      "If the spiral continues, reach out. You don't have to white-knuckle through this alone.",
  },
  {
    id: 'executive-paralysis',
    label: "I can't start",
    description: "You know what to do. Your body just won't move yet.",
    routing: 'in-app',
    validation:
      "This is neurological, not laziness. Your executive system is offline. That's not a character flaw. It happens to neurodivergent brains under stress, fatigue, or overwhelm.",
    stabilizationSteps: [
      {
        instruction:
          'Remove the "should." Forget what you\'re supposed to do. One thing. One micro-action. Text one person. Drink water. Move to a different room.',
        duration: '60 sec',
      },
      {
        instruction:
          "Start with your body, not your brain. Don't think about the task. Stand up. Take one step. Wash your hands. The body moving first breaks the paralysis.",
        duration: '60 sec',
      },
      {
        instruction:
          "Set a timer for 5 minutes. Not 30. Not an hour. 5 minutes. Commit to the timer, not the task. Often, once you start, you'll continue.",
        duration: '5 min',
      },
      {
        instruction:
          'One smallest step. Not the whole thing. If you need to clean, pick up one item. If you need to work, write one sentence. Smallest. Step.',
        duration: 'variable',
      },
    ],
    escalation:
      'If paralysis persists, you may be dealing with deeper burnout or depression. Reach out — professional support might be what you need.',
  },
  {
    id: 'harm-self',
    label: "I'm having thoughts of harming myself",
    description: 'For passive or active thoughts about not being here',
    routing: 'in-app',
    validation:
      "You're here. That matters. Thoughts like these can come without you choosing them — they are not commands, and they are not who you are. If you can stay with me, we'll do a few small things to bring the intensity down. The crisis line is right here below, and there's a path to a real person on the next screen if you need one.",
    stabilizationSteps: [
      {
        instruction:
          'Put one hand somewhere on your body — chest, cheek, the top of your head. Press gently and feel your own warmth. You are still here. Stay for 30 seconds.',
        duration: '30 sec',
      },
      {
        instruction:
          'Cold. If you can, splash cold water on your face or hold something cold to your wrist for 30 seconds. The cold signals your nervous system that the moment is survivable.',
        duration: '30 sec',
      },
      {
        instruction:
          "Slow your breath. In for 4, hold for 4, out for 6. The longer exhale tells your body it's safe to slow down. Do this five times.",
        duration: '90 sec',
      },
      {
        instruction:
          "Name one person, place, or thing you would not want to leave. You don't have to feel reasons to stay. You only have to name one. Even a small one counts.",
        duration: '60 sec',
      },
      {
        instruction:
          "You did this. The next screen will offer you options — a skill, some psychoeducation, or a real person to talk to. None of them are required. You're allowed to just sit for a minute first.",
        duration: '—',
      },
    ],
    escalation:
      'If these thoughts feel urgent or you are not sure you are safe, please reach out right now. Call or text 988. Text HELLO to 741741. Or open "Talk to a person" on the next screen.',
  },
  {
    id: 'harm-others',
    label: "I'm having thoughts of harming someone",
    description: "This one's for in-person care, not an app",
    routing: 'out-of-app-immediate',
    validation:
      "Thank you for telling the truth about what's here. SOLA is not the right tool for this moment — we're going to point you at people who are. You're not in trouble for these thoughts. They are a signal that you need a real person, in person, right now.",
    stabilizationSteps: [],
    escalation:
      'Please go to your nearest emergency room, or call 911. You can also call 988 and tell them what\'s happening — they help with thoughts of harming others, not only self.',
  },
];

export type SosBranchOption = {
  id: 'psychoeducation' | 'dbt' | 'mindfulness' | 'art' | 'human';
  label: string;
  description: string;
  comingSoon?: boolean;
};

export const SOS_BRANCH_OPTIONS: SosBranchOption[] = [
  {
    id: 'psychoeducation',
    label: 'Why this happens',
    description: 'Learn what your nervous system was doing',
  },
  {
    id: 'dbt',
    label: 'A skill to try',
    description: 'DBT tool to keep the steadiness going',
  },
  {
    id: 'mindfulness',
    label: 'Sit with it',
    description: 'A few minutes of mindfulness or quiet',
  },
  {
    id: 'art',
    label: 'Express it',
    description: 'A small art prompt — no skill required',
    comingSoon: true,
  },
  {
    id: 'human',
    label: 'Talk to a real person',
    description: 'Same-day support — launching soon in MS',
    comingSoon: true,
  },
];
