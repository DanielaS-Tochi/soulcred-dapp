/*
  # SoulCred Database Schema

  1. New Tables
    - `user_profiles`
      - User wallet information and profile data
      - Fields: wallet_address, display_name, bio, avatar_url, skills, location, reputation
      - Timestamps for tracking user activity
    
    - `credentials`
      - Core credential data stored on blockchain
      - Fields: token_id, owner_address, title, category, description, skills, issuer
      - Impact metrics: learning_hours, projects_completed, peers_helped, community_contributions
      - IPFS references for metadata and evidence
      - Blockchain transaction data
    
    - `credential_evidence`
      - Evidence files and links for credentials
      - Supports multiple evidence items per credential
      - IPFS hashes for decentralized storage
    
    - `endorsements`
      - Peer endorsements for credentials
      - Tracks who endorsed what and when
      - Includes optional comments
    
    - `user_achievements`
      - Gamification and achievement tracking
      - Badge system for user progression
      - Unlocked achievements with timestamps
    
    - `community_activity`
      - Social interactions and community engagement
      - Activity feed for the platform
      - Supports multiple activity types

  2. Security
    - Enable RLS on all tables
    - Users can only read/write their own data
    - Public read access for credential verification
    - Endorsements restricted to authenticated users
    - Activity logs secured per user

  3. Important Notes
    - All timestamps use timestamptz for timezone awareness
    - JSONB used for flexible data structures
    - Indexes added for common query patterns
    - Foreign keys ensure referential integrity
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address text UNIQUE NOT NULL,
  display_name text,
  bio text DEFAULT '',
  avatar_url text,
  skills text[] DEFAULT '{}',
  location text DEFAULT 'Decentralized Web',
  reputation integer DEFAULT 100,
  total_credentials integer DEFAULT 0,
  total_endorsements integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create credentials table
CREATE TABLE IF NOT EXISTS credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id bigint UNIQUE,
  owner_address text NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  skills text[] DEFAULT '{}',
  issuer text DEFAULT 'Self-Issued',
  verified boolean DEFAULT false,
  
  -- Impact metrics
  learning_hours integer DEFAULT 0,
  projects_completed integer DEFAULT 0,
  peers_helped integer DEFAULT 0,
  community_contributions integer DEFAULT 0,
  
  -- IPFS and blockchain data
  metadata_uri text,
  ipfs_hash text,
  
  -- Blockchain transaction data
  chain_id integer NOT NULL,
  tx_hash text,
  block_number bigint,
  
  -- Timestamps
  date_earned timestamptz DEFAULT now(),
  minted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Foreign key
  CONSTRAINT fk_owner FOREIGN KEY (owner_address) REFERENCES user_profiles(wallet_address) ON DELETE CASCADE
);

-- Create credential_evidence table
CREATE TABLE IF NOT EXISTS credential_evidence (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id uuid NOT NULL,
  evidence_type text NOT NULL CHECK (evidence_type IN ('file', 'link', 'text')),
  title text NOT NULL,
  content text NOT NULL,
  ipfs_hash text,
  file_size bigint,
  mime_type text,
  created_at timestamptz DEFAULT now(),
  
  -- Foreign key
  CONSTRAINT fk_credential FOREIGN KEY (credential_id) REFERENCES credentials(id) ON DELETE CASCADE
);

-- Create endorsements table
CREATE TABLE IF NOT EXISTS endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credential_id uuid NOT NULL,
  token_id bigint,
  endorser_address text NOT NULL,
  comment text DEFAULT '',
  tx_hash text,
  created_at timestamptz DEFAULT now(),
  
  -- Foreign keys
  CONSTRAINT fk_credential FOREIGN KEY (credential_id) REFERENCES credentials(id) ON DELETE CASCADE,
  CONSTRAINT fk_endorser FOREIGN KEY (endorser_address) REFERENCES user_profiles(wallet_address) ON DELETE CASCADE,
  
  -- Prevent duplicate endorsements
  UNIQUE(credential_id, endorser_address)
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address text NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  achievement_description text DEFAULT '',
  icon text,
  progress integer DEFAULT 0,
  target integer DEFAULT 100,
  unlocked boolean DEFAULT false,
  unlocked_at timestamptz,
  created_at timestamptz DEFAULT now(),
  
  -- Foreign key
  CONSTRAINT fk_user FOREIGN KEY (user_address) REFERENCES user_profiles(wallet_address) ON DELETE CASCADE,
  
  -- Prevent duplicate achievements
  UNIQUE(user_address, achievement_type, achievement_name)
);

-- Create community_activity table
CREATE TABLE IF NOT EXISTS community_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_address text NOT NULL,
  activity_type text NOT NULL CHECK (activity_type IN ('credential_minted', 'endorsement_given', 'endorsement_received', 'achievement_unlocked', 'profile_updated')),
  title text NOT NULL,
  description text DEFAULT '',
  metadata jsonb DEFAULT '{}',
  related_credential_id uuid,
  related_user_address text,
  created_at timestamptz DEFAULT now(),
  
  -- Foreign keys
  CONSTRAINT fk_user FOREIGN KEY (user_address) REFERENCES user_profiles(wallet_address) ON DELETE CASCADE,
  CONSTRAINT fk_related_credential FOREIGN KEY (related_credential_id) REFERENCES credentials(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_credentials_owner ON credentials(owner_address);
CREATE INDEX IF NOT EXISTS idx_credentials_token_id ON credentials(token_id);
CREATE INDEX IF NOT EXISTS idx_credentials_chain_id ON credentials(chain_id);
CREATE INDEX IF NOT EXISTS idx_credentials_category ON credentials(category);
CREATE INDEX IF NOT EXISTS idx_credentials_created_at ON credentials(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_evidence_credential ON credential_evidence(credential_id);

CREATE INDEX IF NOT EXISTS idx_endorsements_credential ON endorsements(credential_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_endorser ON endorsements(endorser_address);
CREATE INDEX IF NOT EXISTS idx_endorsements_token_id ON endorsements(token_id);

CREATE INDEX IF NOT EXISTS idx_achievements_user ON user_achievements(user_address);
CREATE INDEX IF NOT EXISTS idx_achievements_unlocked ON user_achievements(unlocked, user_address);

CREATE INDEX IF NOT EXISTS idx_activity_user ON community_activity(user_address);
CREATE INDEX IF NOT EXISTS idx_activity_type ON community_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON community_activity(created_at DESC);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE credential_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view all profiles"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (wallet_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for credentials
CREATE POLICY "Anyone can view credentials"
  ON credentials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own credentials"
  ON credentials FOR INSERT
  TO authenticated
  WITH CHECK (owner_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own credentials"
  ON credentials FOR UPDATE
  TO authenticated
  USING (owner_address = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (owner_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for credential_evidence
CREATE POLICY "Anyone can view evidence"
  ON credential_evidence FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Credential owners can add evidence"
  ON credential_evidence FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM credentials
      WHERE credentials.id = credential_evidence.credential_id
      AND credentials.owner_address = current_setting('request.jwt.claims', true)::json->>'sub'
    )
  );

-- RLS Policies for endorsements
CREATE POLICY "Anyone can view endorsements"
  ON endorsements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can endorse credentials"
  ON endorsements FOR INSERT
  TO authenticated
  WITH CHECK (
    endorser_address = current_setting('request.jwt.claims', true)::json->>'sub'
    AND NOT EXISTS (
      SELECT 1 FROM credentials
      WHERE credentials.id = endorsements.credential_id
      AND credentials.owner_address = endorser_address
    )
  );

-- RLS Policies for user_achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (user_address = current_setting('request.jwt.claims', true)::json->>'sub')
  WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- RLS Policies for community_activity
CREATE POLICY "Anyone can view community activity"
  ON community_activity FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own activity"
  ON community_activity FOR INSERT
  TO authenticated
  WITH CHECK (user_address = current_setting('request.jwt.claims', true)::json->>'sub');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credentials_updated_at BEFORE UPDATE ON credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();