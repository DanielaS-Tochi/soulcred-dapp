# SoulCred Production Deployment Guide

This guide provides comprehensive instructions for deploying SoulCred to production with all features properly configured.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [IPFS Configuration](#ipfs-configuration)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying to production, ensure you have:

1. **Netlify Account** (or another hosting provider)
2. **Supabase Account** for database
3. **Pinata Account** for IPFS storage
4. **Blockchain RPC Provider** (Alchemy or Infura recommended)
5. **WalletConnect Project ID** (optional but recommended)

## Environment Setup

### Step 1: Create Production Environment File

Create a `.env.production` file with the following variables:

```bash
# REQUIRED: IPFS Storage
VITE_PINATA_JWT=your_production_pinata_jwt
PINATA_JWT=your_production_pinata_jwt

# REQUIRED: Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# RECOMMENDED: Blockchain RPC (choose one or both)
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_INFURA_API_KEY=your_infura_api_key

# RECOMMENDED: Mobile Wallet Support
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# OPTIONAL: Feature Flags
VITE_ENABLE_MAINNET=false
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

### Step 2: Get API Keys

#### Pinata (REQUIRED)
1. Go to [pinata.cloud](https://pinata.cloud)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key with pinning permissions
5. Copy the JWT token

#### Supabase (REQUIRED for production)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. Run the database migration (see Database Configuration)

#### Alchemy (Recommended)
1. Go to [alchemy.com](https://alchemy.com)
2. Create account and new app
3. Select Ethereum Sepolia network
4. Copy the API key

#### WalletConnect (Recommended)
1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Create new project
3. Copy the Project ID

## Database Configuration

### Step 1: Run Database Migrations

The database schema is already created via Supabase migration. To verify:

1. Log into your Supabase project
2. Go to Table Editor
3. Verify these tables exist:
   - `user_profiles`
   - `credentials`
   - `credential_evidence`
   - `endorsements`
   - `user_achievements`
   - `community_activity`

### Step 2: Configure Row Level Security

RLS policies are automatically applied through the migration. Verify by:

1. Go to Authentication > Policies
2. Confirm policies exist for each table
3. Test by creating a user and attempting to access data

### Step 3: Enable Realtime (Optional)

For real-time features:

1. Go to Database > Replication
2. Enable replication for tables you want real-time updates on
3. Particularly useful for `community_activity` and `endorsements`

## IPFS Configuration

### Step 1: Configure Netlify Function

The Netlify function `uploadToPinata` is already configured. Ensure:

1. `PINATA_JWT` is set in Netlify environment variables
2. Function is deployed and accessible at `/.netlify/functions/uploadToPinata`

### Step 2: Test IPFS Upload

After deployment, test file upload:

```bash
curl -X POST https://your-app.netlify.app/.netlify/functions/uploadToPinata \
  -H "Content-Type: application/json" \
  -d '{"json": {"test": true}, "metadata": {"name": "test"}}'
```

## Deployment Steps

### Option 1: Netlify (Recommended)

#### Via GitHub Integration

1. **Connect Repository**
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Production ready"
   git push origin main
   ```

2. **Configure Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect to your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
     - Node version: `18.x` or higher

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add all variables from your `.env.production`
   - Make sure to include both `VITE_*` and non-prefixed versions

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be available at `https://your-site.netlify.app`

#### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
npm run build
netlify deploy --prod --dir=dist
```

### Option 2: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option 3: Custom Server

```bash
# Build
npm run build

# Serve the dist folder with any static server
# Example with serve:
npm install -g serve
serve -s dist -l 3000
```

## Post-Deployment

### Step 1: Verify Deployment

Check these critical features:

1. **Environment Validation**
   - Open browser console
   - Look for "SoulCred Environment Validation" output
   - Verify all features show as "Configured" or "Enabled"

2. **Wallet Connection**
   - Click "Connect Wallet"
   - Ensure MetaMask connects successfully
   - Verify wallet address displays correctly

3. **Database Connection**
   - Create a profile (should save to Supabase)
   - Check Supabase dashboard for new user record

4. **IPFS Upload**
   - Try minting a credential with file evidence
   - Verify file uploads to Pinata successfully

### Step 2: Configure Custom Domain (Optional)

For Netlify:
1. Go to Domain settings
2. Add custom domain
3. Configure DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

### Step 3: Set Up Analytics (Optional)

Add analytics to track usage:

1. **Netlify Analytics**
   - Enable in Site settings > Analytics
   - View traffic, performance metrics

2. **Custom Analytics**
   - Set `VITE_ENABLE_ANALYTICS=true`
   - Implement your analytics provider
   - Track key metrics: wallet connections, credentials minted, errors

## Monitoring & Maintenance

### Error Monitoring

The app includes built-in error monitoring:

1. **View Errors in Console**
   - Open browser DevTools
   - Check Console for error logs
   - All errors are categorized by severity

2. **Export Error Reports**
   ```javascript
   // In browser console
   errorMonitor.exportErrors()
   ```

3. **Check Error Stats**
   ```javascript
   // In browser console
   errorMonitor.getErrorStats()
   ```

### Database Monitoring

1. **Check Supabase Dashboard**
   - Monitor active connections
   - Review database performance
   - Check for slow queries

2. **Review RLS Policies**
   - Regularly audit security policies
   - Ensure no unauthorized access

3. **Backup Strategy**
   - Supabase provides automatic daily backups
   - Consider additional backups for critical data

### Performance Monitoring

1. **Lighthouse Audits**
   ```bash
   # Run Lighthouse
   npx lighthouse https://your-app.netlify.app --view
   ```

2. **Bundle Size Analysis**
   ```bash
   npm run analyze
   ```

3. **Network Monitoring**
   - Monitor RPC call success rates
   - Track IPFS upload performance
   - Review blockchain transaction times

## Troubleshooting

### Common Issues

#### 1. Wallet Connection Fails

**Symptoms:** "Connect Wallet" button doesn't work or shows errors

**Solutions:**
- Verify MetaMask is installed
- Check wallet is on a supported network (Sepolia, Mumbai, Goerli)
- Clear browser cache and cookies
- Check `VITE_WALLETCONNECT_PROJECT_ID` is set

#### 2. File Upload Fails

**Symptoms:** Error when uploading evidence files

**Solutions:**
- Verify `PINATA_JWT` is set correctly
- Check Netlify function is deployed
- Ensure file size is under 100MB
- Verify Pinata API key has pinning permissions

#### 3. Database Connection Issues

**Symptoms:** Profile not saving, data not persisting

**Solutions:**
- Verify Supabase credentials are correct
- Check RLS policies are properly configured
- Review Supabase logs for errors
- Ensure authentication is working

#### 4. Build Failures

**Symptoms:** Deployment fails during build

**Solutions:**
- Check Node version (18.x or higher required)
- Run `npm install` to update dependencies
- Review build logs for specific errors
- Verify environment variables are set

#### 5. Smart Contract Issues

**Symptoms:** Transactions fail or contract not found

**Solutions:**
- Verify correct network is selected
- Check contract address in `src/config/blockchain.ts`
- Ensure wallet has test ETH for gas
- Review blockchain explorer for transaction details

### Debug Mode

Enable verbose logging:

```javascript
// In browser console
localStorage.setItem('debug', 'soulcred:*')
```

### Getting Help

1. Check GitHub Issues
2. Review error logs
3. Check Supabase logs
4. Review Netlify deployment logs

## Security Checklist

Before going to production:

- [ ] All API keys are in environment variables (not hardcoded)
- [ ] RLS policies are enabled on all database tables
- [ ] HTTPS is enabled on custom domain
- [ ] Environment validation passes
- [ ] No sensitive data in console logs
- [ ] CORS is properly configured
- [ ] Error handling is in place for all critical paths
- [ ] Rate limiting considered for public endpoints
- [ ] Smart contract is audited (if using mainnet)

## Performance Checklist

- [ ] Lazy loading implemented for heavy components
- [ ] Images optimized
- [ ] Bundle size under acceptable limits
- [ ] Lighthouse score > 90 for all categories
- [ ] Database queries are indexed
- [ ] IPFS uploads are chunked for large files
- [ ] Error boundaries in place

## Maintenance Schedule

### Daily
- Monitor error logs
- Check uptime
- Review critical alerts

### Weekly
- Review database performance
- Check for security updates
- Monitor bundle size changes

### Monthly
- Update dependencies
- Review and optimize database queries
- Audit RLS policies
- Performance testing

## Rollback Procedure

If deployment issues occur:

1. **Netlify**
   - Go to Deploys
   - Click on previous successful deploy
   - Click "Publish deploy"

2. **Database**
   - Supabase provides point-in-time recovery
   - Contact support for emergency rollback

3. **Emergency Contacts**
   - Keep list of critical service contacts
   - Netlify, Supabase, Pinata support

---

## Next Steps

After successful deployment:

1. Monitor initial user feedback
2. Track key metrics
3. Plan feature iterations
4. Scale infrastructure as needed
5. Consider mainnet deployment (requires audit)

For questions or issues, refer to the main README or create a GitHub issue.
