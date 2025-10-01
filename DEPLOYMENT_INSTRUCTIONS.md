# SoulCred Deployment Instructions

## Deploy to Netlify with Custom Domain (soulcred.xyz)

### Step 1: Deploy to Netlify

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Netlify site**:
   ```bash
   netlify init
   ```
   - Choose "Create & configure a new site"
   - Select your team
   - Choose a unique site name (e.g., "soulcred")

4. **Deploy to production**:
   ```bash
   netlify deploy --prod
   ```

### Step 2: Set Environment Variables in Netlify

Go to your Netlify dashboard → Site settings → Environment variables

Add these variables:

```
VITE_SUPABASE_URL=https://0ec90b57d6e95fcbda19832f.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw
```

Optional (for enhanced features):
```
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
VITE_ALCHEMY_API_KEY=your_alchemy_key_here
VITE_PINATA_API_KEY=your_pinata_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_here
```

### Step 3: Configure Custom Domain (soulcred.xyz)

#### In Netlify Dashboard:

1. Go to your site → Domain settings
2. Click "Add custom domain"
3. Enter: `soulcred.xyz`
4. Click "Verify"
5. Also add: `www.soulcred.xyz`

#### In Namecheap:

1. Login to Namecheap
2. Go to Domain List → soulcred.xyz → Manage
3. Go to "Advanced DNS" tab
4. Delete any existing A records or CNAME records
5. Add these DNS records:

**For root domain (soulcred.xyz):**
```
Type: A Record
Host: @
Value: 75.2.60.5
TTL: Automatic
```

**For www subdomain:**
```
Type: CNAME Record
Host: www
Value: [your-site-name].netlify.app
TTL: Automatic
```

**Note:** Replace `[your-site-name]` with your actual Netlify site name

6. Wait 5-30 minutes for DNS propagation

### Step 4: Enable HTTPS

1. In Netlify → Domain settings
2. Under "HTTPS", click "Verify DNS configuration"
3. Once verified, click "Provision certificate"
4. Wait a few minutes for SSL certificate to be issued

### Step 5: Test Your Deployment

Visit these URLs to verify:
- https://soulcred.xyz
- https://www.soulcred.xyz
- Your Netlify URL: https://[your-site-name].netlify.app

Test these features:
- ✅ Wallet connection
- ✅ Profile creation
- ✅ Profile editing
- ✅ Dashboard loads
- ✅ All pages navigate correctly

## Troubleshooting

### DNS Not Resolving
- Wait up to 48 hours for full DNS propagation
- Check DNS with: `nslookup soulcred.xyz`
- Clear your browser cache

### Build Fails
- Check environment variables are set correctly
- Verify Node version is 18 or higher
- Check build logs in Netlify dashboard

### Wallet Connection Issues
- Check browser console for errors
- Ensure MetaMask or wallet extension is installed
- Try clearing browser cache and reconnecting

### Database Connection Issues
- Verify Supabase environment variables are correct
- Check Supabase dashboard for any service issues
- Test database connection in browser console

## Quick Deploy Commands

```bash
# Deploy to production
npm run deploy

# Or manually
npm run build
netlify deploy --prod

# Check deployment status
netlify status

# Open site in browser
netlify open:site

# View build logs
netlify open
```

## Continuous Deployment

After initial setup, every git push to your main branch will automatically deploy to Netlify if you:

1. Connect your GitHub repository in Netlify dashboard
2. Go to Site settings → Build & deploy → Continuous deployment
3. Link your repository
4. Set branch to deploy: `main` or `master`

## Post-Deployment Checklist

- [ ] Site loads at soulcred.xyz
- [ ] HTTPS enabled (green lock icon)
- [ ] Wallet connection works
- [ ] User profiles save to database
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Social media preview (add og:image meta tags)

## Next Steps After Deployment

1. **Add OpenGraph meta tags** for social media sharing
2. **Set up analytics** (Google Analytics, Plausible, etc.)
3. **Enable Netlify Forms** for contact/feedback
4. **Add status page** monitoring
5. **Configure redirects** if needed
6. **Implement credential minting** functionality
7. **Add payment integration** for monetization

## Support

If you encounter issues:
- Check Netlify build logs
- Review browser console errors
- Check Supabase dashboard for database issues
- Verify environment variables are set correctly
