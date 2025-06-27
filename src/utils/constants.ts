/**
 * Application constants and configuration
 */

// Application metadata
export const APP_CONFIG = {
  name: 'SoulCred',
  description: 'Decentralized platform for issuing and managing Soulbound Tokens that represent learning achievements and community contributions.',
  version: '1.0.0',
  author: 'Daniela Silvana Tochi',
  website: 'https://soulcred.app',
  repository: 'https://github.com/danielas-tochi/soulcred-dapp',
  support: 'support@soulcred.app',
} as const;

// Network configurations
export const NETWORK_CONFIG = {
  MAINNET_CHAIN_ID: 1,
  POLYGON_CHAIN_ID: 137,
  SEPOLIA_CHAIN_ID: 11155111,
  MUMBAI_CHAIN_ID: 80001,
  GOERLI_CHAIN_ID: 5,
} as const;

// File upload limits
export const FILE_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_CREDENTIAL: 5,
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ],
} as const;

// Form validation limits
export const VALIDATION_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  BIO_MAX_LENGTH: 500,
  NAME_MAX_LENGTH: 100,
  LOCATION_MAX_LENGTH: 100,
  ISSUER_MAX_LENGTH: 100,
  SKILL_MAX_LENGTH: 50,
  MAX_SKILLS_PER_CREDENTIAL: 20,
  MAX_SKILLS_PER_USER: 50,
  MAX_EVIDENCE_LINKS: 10,
  MAX_IMPACT_METRICS: {
    learningHours: 10000,
    projectsCompleted: 1000,
    peersHelped: 10000,
    communityContributions: 1000,
  },
} as const;

// UI constants
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 12,
  SEARCH_MIN_LENGTH: 2,
  SEARCH_MAX_LENGTH: 100,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
  ANIMATION_DURATION: 300,
} as const;

// Credential categories
export const CREDENTIAL_CATEGORIES = [
  'Programming',
  'Blockchain',
  'Leadership',
  'Design',
  'Security',
  'Education',
  'Research',
  'Community',
  'Data Science',
  'DevOps',
  'Product Management',
  'Marketing',
  'Finance',
  'Healthcare',
  'Legal',
  'Other',
] as const;

// Skill categories for better organization
export const SKILL_CATEGORIES = {
  'Programming': [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
    'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask',
    'Spring Boot', 'Laravel', 'Ruby on Rails'
  ],
  'Blockchain': [
    'Solidity', 'Web3', 'Smart Contracts', 'DeFi', 'NFTs', 'Ethereum',
    'Bitcoin', 'Polygon', 'Chainlink', 'IPFS', 'MetaMask', 'Hardhat',
    'Truffle', 'OpenZeppelin'
  ],
  'Design': [
    'UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping',
    'User Research', 'Design Systems', 'Accessibility', 'Wireframing',
    'Visual Design', 'Interaction Design'
  ],
  'Data Science': [
    'Machine Learning', 'Deep Learning', 'Data Analysis', 'Statistics',
    'Python', 'R', 'SQL', 'Pandas', 'NumPy', 'TensorFlow', 'PyTorch',
    'Jupyter', 'Tableau', 'Power BI'
  ],
  'DevOps': [
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Jenkins',
    'GitLab', 'Terraform', 'Ansible', 'Monitoring', 'Linux', 'Bash'
  ],
} as const;

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue',
  NETWORK_NOT_SUPPORTED: 'Please switch to a supported network',
  CONTRACT_NOT_DEPLOYED: 'Smart contract not deployed on this network',
  IPFS_NOT_CONFIGURED: 'IPFS service not configured',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'File type not supported',
  FORM_VALIDATION_FAILED: 'Please fix the form errors before continuing',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREDENTIAL_MINTED: 'Credential successfully minted!',
  PROFILE_UPDATED: 'Profile updated successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  ENDORSEMENT_ADDED: 'Endorsement added successfully',
  CONNECTION_SUCCESSFUL: 'Wallet connected successfully',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'soulcred-user-profile',
  THEME: 'soulcred-theme',
  LANGUAGE: 'soulcred-language',
  WALLET_PREFERENCE: 'soulcred-wallet-preference',
  ONBOARDING_COMPLETED: 'soulcred-onboarding-completed',
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.soulcred.app',
  CREDENTIALS: '/api/credentials',
  USERS: '/api/users',
  ENDORSEMENTS: '/api/endorsements',
  ANALYTICS: '/api/analytics',
  HEALTH: '/api/health',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com/danielas-tochi/soulcred-dapp',
  LINKEDIN: 'https://linkedin.com/in/daniela-silvana-tochi',
  TWITTER: 'https://twitter.com/SoulCredApp',
  DISCORD: 'https://discord.gg/soulcred',
  TELEGRAM: 'https://t.me/soulcred',
} as const;

// External service URLs
export const EXTERNAL_SERVICES = {
  ALCHEMY: 'https://alchemy.com',
  INFURA: 'https://infura.io',
  PINATA: 'https://pinata.cloud',
  WALLETCONNECT: 'https://cloud.walletconnect.com',
  METAMASK: 'https://metamask.io',
  RAINBOW: 'https://rainbow.me',
  COINBASE_WALLET: 'https://www.coinbase.com/wallet',
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  ENABLE_BETA_FEATURES: import.meta.env.VITE_ENABLE_BETA_FEATURES === 'true',
  ENABLE_MAINNET: import.meta.env.VITE_ENABLE_MAINNET === 'true',
} as const;

// Rate limiting
export const RATE_LIMITS = {
  CREDENTIAL_MINTING: { maxAttempts: 5, windowMs: 60000 }, // 5 attempts per minute
  FILE_UPLOAD: { maxAttempts: 10, windowMs: 60000 }, // 10 uploads per minute
  SEARCH: { maxAttempts: 30, windowMs: 60000 }, // 30 searches per minute
  ENDORSEMENT: { maxAttempts: 20, windowMs: 60000 }, // 20 endorsements per minute
} as const;

// Accessibility
export const A11Y_CONFIG = {
  FOCUS_VISIBLE_OUTLINE: '3px solid #8b5cf6',
  FOCUS_VISIBLE_OFFSET: '2px',
  MIN_TOUCH_TARGET: 44, // pixels
  MIN_COLOR_CONTRAST: 4.5, // WCAG AA standard
} as const;

// Performance
export const PERFORMANCE_CONFIG = {
  IMAGE_LAZY_LOADING_THRESHOLD: 100, // pixels
  VIRTUAL_SCROLL_ITEM_HEIGHT: 200, // pixels
  DEBOUNCE_SEARCH: 300, // milliseconds
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
} as const;

// Security
export const SECURITY_CONFIG = {
  CSP_NONCE_LENGTH: 32,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

export type CredentialCategory = typeof CREDENTIAL_CATEGORIES[number];
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
export type SuccessMessage = typeof SUCCESS_MESSAGES[keyof typeof SUCCESS_MESSAGES];