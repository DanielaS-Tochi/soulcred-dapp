import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured - database features will be limited');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export interface UserProfile {
  id?: string;
  wallet_address: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  skills?: string[];
  location?: string;
  reputation?: number;
  total_credentials?: number;
  total_endorsements?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Credential {
  id?: string;
  token_id?: number;
  owner_address: string;
  title: string;
  category: string;
  description: string;
  skills?: string[];
  issuer?: string;
  verified?: boolean;
  learning_hours?: number;
  projects_completed?: number;
  peers_helped?: number;
  community_contributions?: number;
  metadata_uri?: string;
  ipfs_hash?: string;
  chain_id: number;
  tx_hash?: string;
  block_number?: number;
  date_earned?: string;
  minted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CredentialEvidence {
  id?: string;
  credential_id: string;
  evidence_type: 'file' | 'link' | 'text';
  title: string;
  content: string;
  ipfs_hash?: string;
  file_size?: number;
  mime_type?: string;
  created_at?: string;
}

export interface Endorsement {
  id?: string;
  credential_id: string;
  token_id?: number;
  endorser_address: string;
  comment?: string;
  tx_hash?: string;
  created_at?: string;
}

export interface UserAchievement {
  id?: string;
  user_address: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description?: string;
  icon?: string;
  progress?: number;
  target?: number;
  unlocked?: boolean;
  unlocked_at?: string;
  created_at?: string;
}

export interface CommunityActivity {
  id?: string;
  user_address: string;
  activity_type: 'credential_minted' | 'endorsement_given' | 'endorsement_received' | 'achievement_unlocked' | 'profile_updated';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  related_credential_id?: string;
  related_user_address?: string;
  created_at?: string;
}

export class DatabaseService {
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!supabaseUrl && !!supabaseAnonKey &&
                       supabaseUrl !== 'https://placeholder.supabase.co';
  }

  isReady(): boolean {
    return this.isConfigured;
  }

  async getUserProfile(walletAddress: string): Promise<UserProfile | null> {
    if (!this.isConfigured) {
      return this.getFallbackUserProfile(walletAddress);
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('wallet_address', walletAddress)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return this.getFallbackUserProfile(walletAddress);
    }
  }

  async createUserProfile(profile: UserProfile): Promise<UserProfile | null> {
    if (!this.isConfigured) {
      return this.saveFallbackUserProfile(profile);
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return this.saveFallbackUserProfile(profile);
    }
  }

  async updateUserProfile(walletAddress: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!this.isConfigured) {
      return this.updateFallbackUserProfile(walletAddress, updates);
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('wallet_address', walletAddress)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return this.updateFallbackUserProfile(walletAddress, updates);
    }
  }

  async getUserCredentials(walletAddress: string): Promise<Credential[]> {
    if (!this.isConfigured) {
      return this.getFallbackCredentials(walletAddress);
    }

    try {
      const { data, error } = await supabase
        .from('credentials')
        .select('*')
        .eq('owner_address', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching credentials:', error);
      return this.getFallbackCredentials(walletAddress);
    }
  }

  async createCredential(credential: Credential): Promise<Credential | null> {
    if (!this.isConfigured) {
      return this.saveFallbackCredential(credential);
    }

    try {
      const { data, error } = await supabase
        .from('credentials')
        .insert(credential)
        .select()
        .single();

      if (error) throw error;

      await this.createActivity({
        user_address: credential.owner_address,
        activity_type: 'credential_minted',
        title: `Minted "${credential.title}"`,
        description: `New ${credential.category} credential`,
        related_credential_id: data.id,
      });

      return data;
    } catch (error) {
      console.error('Error creating credential:', error);
      return this.saveFallbackCredential(credential);
    }
  }

  async getCredentialEvidence(credentialId: string): Promise<CredentialEvidence[]> {
    if (!this.isConfigured) return [];

    try {
      const { data, error } = await supabase
        .from('credential_evidence')
        .select('*')
        .eq('credential_id', credentialId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching evidence:', error);
      return [];
    }
  }

  async addCredentialEvidence(evidence: CredentialEvidence): Promise<CredentialEvidence | null> {
    if (!this.isConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('credential_evidence')
        .insert(evidence)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding evidence:', error);
      return null;
    }
  }

  async getEndorsements(credentialId: string): Promise<Endorsement[]> {
    if (!this.isConfigured) {
      return this.getFallbackEndorsements(credentialId);
    }

    try {
      const { data, error } = await supabase
        .from('endorsements')
        .select('*')
        .eq('credential_id', credentialId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching endorsements:', error);
      return this.getFallbackEndorsements(credentialId);
    }
  }

  async createEndorsement(endorsement: Endorsement): Promise<Endorsement | null> {
    if (!this.isConfigured) {
      return this.saveFallbackEndorsement(endorsement);
    }

    try {
      const { data, error } = await supabase
        .from('endorsements')
        .insert(endorsement)
        .select()
        .single();

      if (error) throw error;

      await this.createActivity({
        user_address: endorsement.endorser_address,
        activity_type: 'endorsement_given',
        title: 'Endorsed a credential',
        related_credential_id: endorsement.credential_id,
      });

      return data;
    } catch (error) {
      console.error('Error creating endorsement:', error);
      return this.saveFallbackEndorsement(endorsement);
    }
  }

  async getUserAchievements(walletAddress: string): Promise<UserAchievement[]> {
    if (!this.isConfigured) {
      return this.getFallbackAchievements(walletAddress);
    }

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_address', walletAddress)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return this.getFallbackAchievements(walletAddress);
    }
  }

  async createAchievement(achievement: UserAchievement): Promise<UserAchievement | null> {
    if (!this.isConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert(achievement)
        .select()
        .single();

      if (error) throw error;

      if (achievement.unlocked) {
        await this.createActivity({
          user_address: achievement.user_address,
          activity_type: 'achievement_unlocked',
          title: `Unlocked: ${achievement.achievement_name}`,
          description: achievement.achievement_description,
        });
      }

      return data;
    } catch (error) {
      console.error('Error creating achievement:', error);
      return null;
    }
  }

  async getCommunityActivity(limit: number = 50): Promise<CommunityActivity[]> {
    if (!this.isConfigured) {
      return this.getFallbackActivity();
    }

    try {
      const { data, error } = await supabase
        .from('community_activity')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching activity:', error);
      return this.getFallbackActivity();
    }
  }

  async createActivity(activity: CommunityActivity): Promise<CommunityActivity | null> {
    if (!this.isConfigured) return null;

    try {
      const { data, error } = await supabase
        .from('community_activity')
        .insert(activity)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating activity:', error);
      return null;
    }
  }

  private getFallbackUserProfile(walletAddress: string): UserProfile | null {
    const stored = localStorage.getItem(`soulcred-profile-${walletAddress}`);
    return stored ? JSON.parse(stored) : null;
  }

  private saveFallbackUserProfile(profile: UserProfile): UserProfile {
    localStorage.setItem(`soulcred-profile-${profile.wallet_address}`, JSON.stringify(profile));
    return profile;
  }

  private updateFallbackUserProfile(walletAddress: string, updates: Partial<UserProfile>): UserProfile | null {
    const existing = this.getFallbackUserProfile(walletAddress);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    return this.saveFallbackUserProfile(updated);
  }

  private getFallbackCredentials(walletAddress: string): Credential[] {
    const stored = localStorage.getItem(`soulcred-credentials-${walletAddress}`);
    return stored ? JSON.parse(stored) : [];
  }

  private saveFallbackCredential(credential: Credential): Credential {
    const credentials = this.getFallbackCredentials(credential.owner_address);
    credentials.push(credential);
    localStorage.setItem(`soulcred-credentials-${credential.owner_address}`, JSON.stringify(credentials));
    return credential;
  }

  private getFallbackEndorsements(credentialId: string): Endorsement[] {
    const stored = localStorage.getItem(`soulcred-endorsements-${credentialId}`);
    return stored ? JSON.parse(stored) : [];
  }

  private saveFallbackEndorsement(endorsement: Endorsement): Endorsement {
    const endorsements = this.getFallbackEndorsements(endorsement.credential_id);
    endorsements.push(endorsement);
    localStorage.setItem(`soulcred-endorsements-${endorsement.credential_id}`, JSON.stringify(endorsements));
    return endorsement;
  }

  private getFallbackAchievements(walletAddress: string): UserAchievement[] {
    const stored = localStorage.getItem(`soulcred-achievements-${walletAddress}`);
    return stored ? JSON.parse(stored) : [];
  }

  private getFallbackActivity(): CommunityActivity[] {
    const stored = localStorage.getItem('soulcred-activity');
    return stored ? JSON.parse(stored) : [];
  }
}

export const databaseService = new DatabaseService();
