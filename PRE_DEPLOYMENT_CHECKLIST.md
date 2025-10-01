# Pre-Deployment Checklist

Use this checklist before deploying SoulCred to production.

## Configuration

### Required Environment Variables ⚠️

- [ ] `VITE_PINATA_JWT` - CRITICAL for file uploads
- [ ] `PINATA_JWT` - CRITICAL for Netlify function
- [ ] `VITE_SUPABASE_URL` - Recommended for database
- [ ] `VITE_SUPABASE_ANON_KEY` - Recommended for database

### Optional but Recommended Environment Variables

- [ ] `VITE_ALCHEMY_API_KEY` or `VITE_INFURA_API_KEY` - Better RPC performance
- [ ] `VITE_WALLETCONNECT_PROJECT_ID` - Mobile wallet support

## Database Setup

### Supabase Configuration

- [ ] Supabase project created
- [ ] Database migration applied (automatic via MCP tool)
- [ ] Verify all 6 tables exist:
  - [ ] user_profiles
  - [ ] credentials
  - [ ] credential_evidence
  - [ ] endorsements
  - [ ] user_achievements
  - [ ] community_activity

### Security

- [ ] Row Level Security enabled on all tables
- [ ] Policies verified and tested
- [ ] No public write access confirmed

## Build & Test

### Local Testing

- [ ] `npm install` - Dependencies installed
- [ ] `npm run type-check` - No TypeScript errors
- [ ] `npm run build` - Build succeeds
- [ ] Test locally with `npm run preview`

### Feature Testing

- [ ] Environment validation shows correct status
- [ ] Wallet connection works
- [ ] Can view dashboard when connected
- [ ] All navigation works (Dashboard, Profile, Mint, Community, Achievements)

## Deployment Platform

### Netlify (or equivalent)

- [ ] Repository connected
- [ ] Build command: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Node version: 18.x or higher
- [ ] All environment variables added
- [ ] Netlify function `uploadToPinata` deployed

### Domain & SSL

- [ ] Custom domain configured (optional)
- [ ] HTTPS enabled
- [ ] DNS records verified

## Post-Deployment Verification

### Immediate Checks

- [ ] Site loads successfully
- [ ] Open browser console - check environment validation output
- [ ] All features show as configured or have appropriate fallbacks
- [ ] No critical errors in console

### Feature Testing

- [ ] Connect wallet successfully
- [ ] Profile creation works
- [ ] Data persists in Supabase (check dashboard)
- [ ] Navigation works smoothly
- [ ] Lazy loading works (check Network tab)

### IPFS Testing

- [ ] Try minting a credential with file evidence
- [ ] File uploads to Pinata successfully
- [ ] IPFS hash returned
- [ ] File accessible via gateway

## Monitoring Setup

### Error Tracking

- [ ] Open browser console
- [ ] Type: `errorMonitor.getErrorStats()`
- [ ] Verify error monitoring is active

### Performance

- [ ] Run Lighthouse audit
- [ ] Target scores:
  - Performance: 90+
  - Accessibility: 100
  - Best Practices: 95+
  - SEO: 95+

## Security Verification

### Code Security

- [ ] No API keys in code (all in env vars)
- [ ] .env files in .gitignore
- [ ] No sensitive data in console logs
- [ ] Error messages don't expose internals

### Database Security

- [ ] RLS enabled on all tables
- [ ] Test: Try to access another user's data (should fail)
- [ ] Test: Try to modify another user's data (should fail)

## Documentation

- [ ] README.md updated with production URL
- [ ] PRODUCTION_GUIDE.md reviewed
- [ ] Team briefed on error monitoring
- [ ] Support process established

## Backup & Recovery

- [ ] Supabase automatic backups enabled (default)
- [ ] Know how to rollback deployment (Netlify deploy history)
- [ ] LocalStorage fallback tested
- [ ] Emergency contact list ready

## User Communication

- [ ] Announce to users (if applicable)
- [ ] Provide support channels
- [ ] Gather feedback mechanism ready
- [ ] Monitor initial user experience

## Final Checks

### Critical ✅

- [ ] All REQUIRED env vars set
- [ ] Build succeeds without errors
- [ ] Wallet connection works
- [ ] Database saves data correctly
- [ ] IPFS uploads work

### Important ⚠️

- [ ] Supabase configured
- [ ] Error monitoring active
- [ ] Performance acceptable
- [ ] Security verified

### Nice to Have 💡

- [ ] RPC provider configured
- [ ] WalletConnect enabled
- [ ] Analytics ready
- [ ] Monitoring dashboard

## Launch Readiness

**Minimum for Launch:**
- ✅ Pinata configured
- ✅ Site builds and deploys
- ✅ Wallet connection works
- ⚠️ Supabase recommended (or fallback to localStorage)

**Recommended for Launch:**
- ✅ All required items above
- ✅ Supabase database
- ✅ RPC provider
- ✅ Error monitoring verified

**Ideal for Launch:**
- ✅ All recommended items
- ✅ WalletConnect
- ✅ Custom domain
- ✅ Analytics configured
- ✅ Full testing completed

---

## Issue Resolution

If any item fails, consult:
1. **PRODUCTION_GUIDE.md** - Troubleshooting section
2. **OPTIMIZATION_REPORT.md** - Technical details
3. Environment validation console output
4. Error monitoring logs

---

## Sign Off

**Deployment Date:** _______________

**Deployed By:** _______________

**Environment Validation Status:** _______________

**Critical Issues:** _______________

**Notes:**

_______________________________________________

_______________________________________________

_______________________________________________

---

**Status:** [ ] Ready for Production  [ ] Needs Attention

**Confidence Level:** [ ] High  [ ] Medium  [ ] Low

---

*Use this checklist for every deployment to production*
