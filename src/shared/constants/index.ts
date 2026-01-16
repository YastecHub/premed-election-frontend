export const DEPARTMENTS = [
  'Medicine & Surgery (MBBS)',
  'Pharmacy',
  'Pharmacology', 
  'Nursing Science',
  'Medical Laboratory Science',
  'Radiography',
  'Physiology',
  'Anatomy',
  'Physiotherapy',
  'Dentistry'
] as const;

export const VALIDATION = {
  MATRIC_NUMBER: {
    PATTERN: /^\d{9}$/,
    LENGTH: 9,
    ERROR_MESSAGE: 'Invalid Matric Number. Please enter your 9-digit UNILAG Student Number.'
  },
  EMAIL: {
    PATTERN: /@/,
    ERROR_MESSAGE: 'Invalid Email Address'
  }
} as const;

export const ROUTES = {
  VOTER: {
    REGISTER: 'register',
    VERIFY: 'verify', 
    VOTE: 'vote'
  },
  ADMIN: 'admin'
} as const;

export const ELECTION_ACTIONS = {
  START: 'start',
  PAUSE: 'pause',
  RESUME: 'resume',
  STOP: 'stop'
} as const;

export const SOCKET_EVENTS = {
  ELECTION_ENDED: 'election_ended',
  ELECTION_STARTED: 'election_started',
  ELECTION_PAUSED: 'election_paused',
  ELECTION_RESUMED: 'election_resumed',
  USER_STATUS_UPDATE: 'user_status_update'
} as const;