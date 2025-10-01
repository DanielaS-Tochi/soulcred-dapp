# SoulCred dApp - Quick Start Guide

## 🎉 Your Project is Ready!

All code has been committed to your local git repository. Here's how to push it to GitHub and test it:

---

## 📤 Push to GitHub

Run these commands in your terminal (from the project directory):

```bash
# Push to GitHub
git push -u origin main
```

If you get an error about the remote branch, you may need to force push the first time:

```bash
git push -u origin main --force
```

---

## 🧪 Testing Your Project Locally

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Set Up Environment Variables
Make sure your `.env` file has the correct values:

```env
# Your Pinata JWT (already configured)
VITE_PINATA_JWT=your_pinata_jwt_here

# Your Supabase credentials (already configured)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Optional: RPC providers for better performance
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
VITE_INFURA_API_KEY=your_infura_api_key_here
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

### 3. Run Development Server
```bash
npm run dev
```

The app will open at: **http://localhost:5173**

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deploy to Netlify

### Option 1: Deploy via CLI
```bash
npm run deploy
```

### Option 2: Deploy via Netlify Dashboard
1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables from your `.env` file

---

## 🔧 What's Been Fixed

1. ✅ **React StrictMode**: Removed to prevent double-render issues
2. ✅ **ENS Lookups**: Disabled to prevent crashes on testnets
3. ✅ **Build Process**: Optimized and verified working
4. ✅ **Git Repository**: Initialized and ready to push
5. ✅ **Supabase Integration**: Database schema created and ready
6. ✅ **IPFS/Pinata**: Configured for file uploads

---

## 🎮 Testing the App

### Prerequisites
- **MetaMask** or another Web3 wallet installed
- **Sepolia ETH** for testing (get from [Sepolia Faucet](https://sepoliafaucet.com/))

### Steps to Test
1. Open the app in your browser
2. Click "Connect Wallet"
3. Approve the connection in MetaMask
4. You should see the Dashboard with your profile
5. Try minting a credential to test full functionality

---

## 🐛 Troubleshooting Preview Issues

If you can't see the preview in your development environment:

### Check 1: Port Availability
```bash
# Check if port 5173 is in use
lsof -ti:5173
```

### Check 2: Restart Dev Server
```bash
# Stop any running servers and restart
npm run dev
```

### Check 3: Clear Cache
```bash
# Clear Vite cache and restart
npm run clean
npm run dev
```

### Check 4: Browser Console
- Open browser DevTools (F12)
- Check the Console tab for errors
- Look for any failed network requests

---

## 📁 Project Structure

```
soulcred-dapp/
├── src/
│   ├── components/     # React components
│   ├── contexts/       # React contexts (Auth, Theme)
│   ├── services/       # Database, IPFS services
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── config/         # Configuration files
├── contracts/          # Smart contracts
├── supabase/          # Database migrations
└── public/            # Static assets
```

---

## 🔗 Important Links

- **Live Demo**: https://soulcred-dapp.netlify.app
- **GitHub Repo**: https://github.com/danielas-tochi/soulcred-dapp
- **Contract (Sepolia)**: 0xF766558E8042681F5f0861df2e4f06c7A2cfD17b
- **Sepolia Etherscan**: https://sepolia.etherscan.io/address/0xF766558E8042681F5f0861df2e4f06c7A2cfD17b

---

## ✅ Next Steps

1. **Push to GitHub**: `git push -u origin main --force`
2. **Test Locally**: `npm run dev`
3. **Deploy to Netlify**: `npm run deploy`
4. **Share Your dApp**: Share the live URL with others!

---

## 💡 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify your `.env` file has correct values
3. Make sure MetaMask is installed and connected to Sepolia
4. Check that you have Sepolia ETH in your wallet

---

**Good luck with your dApp! 🚀**
