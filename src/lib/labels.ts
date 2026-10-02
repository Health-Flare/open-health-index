// Single source of truth for the enums used in entry files and on the site.
// Keys are what you write in YAML; values are what visitors see.

export const CATEGORIES = {
  symptoms: { label: 'Symptoms, flares & patterns', blurb: 'Log how you feel and spot what makes it better or worse.' },
  mood: { label: 'Mood & mental health', blurb: 'Track mood, journal, and work through hard days.' },
  medications: { label: 'Medications', blurb: 'Reminders, dose logs, and refill tracking.' },
  cycle: { label: 'Cycle & reproductive health', blurb: 'Period, fertility, and contraception tracking that stays private.' },
  diabetes: { label: 'Diabetes', blurb: 'Glucose monitoring and community-built insulin tools.' },
  records: { label: 'Your medical records', blurb: 'Keep your own copy of your health history.' },
  body: { label: 'Body, sleep & food', blurb: 'Wearables, sleep, activity, and what you eat.' },
  communication: { label: 'Communication & accessibility', blurb: 'Tools that help you be understood.' },
  'harm-reduction': { label: 'Harm reduction', blurb: 'Track use and check interactions, without judgement.' },
} as const;

export const PLATFORMS = {
  android: 'Android',
  ios: 'iPhone',
  web: 'Web',
  desktop: 'Desktop',
  'self-hosted': 'Self-hosted',
} as const;

export const SETUP = {
  easy: { label: 'Easy', detail: 'Install from an app store.' },
  medium: { label: 'Medium', detail: 'Install from F-Droid or sideload.' },
  hard: { label: 'Hard', detail: 'Build it yourself or run a server.' },
} as const;

export const DATA_LOCATION = {
  device: 'Stays on your device',
  'self-hosted': 'On a server you run',
  cloud: "On the project's servers",
  mixed: 'Device, with optional sync',
} as const;

export const STATUS = {
  active: 'Active',
  watchlist: 'Watchlist',
  archived: 'No longer maintained',
} as const;

export type Category = keyof typeof CATEGORIES;
