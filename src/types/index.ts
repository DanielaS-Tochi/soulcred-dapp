export interface User {
  id: string;
  address: string;
  name: string;
  bio: string;
  avatar: string;
  skills: string[];
  location: string;
  joinedDate: string;
  totalCredentials: number;
  endorsements: number;
  reputation: number;
}

export interface Credential {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  evidence: string[];
  impactMetrics: {
    learningHours: number;
    projectsCompleted: number;
    peersHelped: number;
    communityContributions: number;
  };
  dateEarned: string;
  issuer: string;
  verified: boolean;
  endorsements: number;
  tokenId?: string;
  imageUrl: string;
}

export interface Achievement {
  id: string;
  userId: string;
  credentialId: string;
  user: User;
  credential: Credential;
  timestamp: string;
  endorsements: Endorsement[];
}

export interface Endorsement {
  id: string;
  endorserId: string;
  credentialId: string;
  endorser: User;
  message: string;
  timestamp: string;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
  error: string | null;
}

export interface AppState {
  currentView: 'dashboard' | 'profile' | 'mint' | 'community' | 'achievements';
  user: User | null;
  credentials: Credential[];
  achievements: Achievement[];
  searchQuery: string;
  selectedCategory: string;
}