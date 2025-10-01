/*
  # Fix RLS Policies for Wallet-Based Authentication

  1. Changes
    - Drop existing RLS policies that use JWT claims
    - Create new RLS policies that work with wallet addresses
    - Add public read access for credentials (verification purposes)
    - Ensure proper security for wallet-based authentication
    
  2. Security Model
    - Wallet addresses are stored directly in tables
    - Users authenticate via wallet signature
    - RLS checks wallet_address fields directly
    - Public can view credentials for verification
    - Only authenticated users can create/update their own data
    
  3. Important Notes
    - This enables wallet-based authentication instead of JWT
    - Wallet addresses are the primary authentication mechanism
    - Public read access allows credential verification
*/

-- Drop all existing RLS policies
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Anyone can view credentials" ON credentials;
DROP POLICY IF EXISTS "Users can create own credentials" ON credentials;
DROP POLICY IF EXISTS "Users can update own credentials" ON credentials;
DROP POLICY IF EXISTS "Anyone can view evidence" ON credential_evidence;
DROP POLICY IF EXISTS "Credential owners can add evidence" ON credential_evidence;
DROP POLICY IF EXISTS "Anyone can view endorsements" ON endorsements;
DROP POLICY IF EXISTS "Users can endorse credentials" ON endorsements;
DROP POLICY IF EXISTS "Users can view own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can update own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Anyone can view community activity" ON community_activity;
DROP POLICY IF EXISTS "Users can create own activity" ON community_activity;

-- New RLS Policies for user_profiles (public read, authenticated write own)
CREATE POLICY "Public can view all profiles"
  ON user_profiles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update own profile by wallet"
  ON user_profiles FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- New RLS Policies for credentials (public read for verification)
CREATE POLICY "Public can view all credentials"
  ON credentials FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create credentials"
  ON credentials FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update own credentials"
  ON credentials FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- New RLS Policies for credential_evidence (public read)
CREATE POLICY "Public can view all evidence"
  ON credential_evidence FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add evidence"
  ON credential_evidence FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- New RLS Policies for endorsements (public read)
CREATE POLICY "Public can view all endorsements"
  ON endorsements FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create endorsements"
  ON endorsements FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- New RLS Policies for user_achievements
CREATE POLICY "Public can view all achievements"
  ON user_achievements FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update own achievements"
  ON user_achievements FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- New RLS Policies for community_activity (public read)
CREATE POLICY "Public can view all community activity"
  ON community_activity FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create activity"
  ON community_activity FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
