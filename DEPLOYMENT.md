# SoulCred Deployment Guide

This guide covers deploying SoulCred to production environments, including smart contract deployment and frontend hosting.

## 🏗️ Smart Contract Deployment

### Prerequisites
- Node.js 18+
- Hardhat development environment
- Testnet ETH for gas fees
- Private key for deployment wallet

### Setup Hardhat Environment

1. **Install Hardhat**
   ```bash
   npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers
   ```

2. **Create hardhat.config.js**
   ```javascript
   require("@nomiclabs/hardhat-ethers");
   require("@nomiclabs/hardhat-etherscan");

   module.exports = {
     solidity: "0.8.19",
     networks: {
       sepolia: {
         url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
         accounts: [process.env.PRIVATE_KEY]
       },
       mumbai: {
         url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
         accounts: [process.env.PRIVATE_KEY]
       }
     },
     etherscan: {
       apiKey: process.env.ETHERSCAN_API_KEY
     }
   };
   ```

3. **Create deployment script**
   ```javascript
   // scripts/deploy.js
   async function main() {
     const SoulCredSBT = await ethers.getContractFactory("SoulCredSBT");
     const soulCredSBT = await SoulCredSBT.deploy();
     await soulCredSBT.deployed();
     
     console.log("SoulCredSBT deployed to:", soulCredSBT.address);
   }
   
   main().catch((error) => {
     console.error(error);
     process.exitCode = 1;
   });
   ```

### Deploy to Testnets

1. **Sepolia Testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

2. **Polygon Mumbai**
   ```bash
   npx hardhat run scripts/deploy.js --network mumbai
   ```

3. **Verify Contracts**
   ```bash
   npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
   ```

## 🌐 Frontend Deployment

### Build Configuration

1. **Update environment variables**
   ```bash
   # Production environment variables
   VITE_ALCHEMY_API_KEY=prod_alchemy_key
   VITE_PINATA_JWT=prod_pinata_jwt
   VITE_WALLETCONNECT_PROJECT_ID=prod_walletconnect_id
   ```

2. **Update contract addresses**
   ```typescript
   // src/config/blockchain.ts
   export const CONTRACT_ADDRESSES = {
     [sepolia.id]: '0xYourDeployedContractAddress',
     [polygonMumbai.id]: '0xYourDeployedContractAddress',
   };
   ```

### Deploy to Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Configure environment variables in Netlify**
   - Go to Site Settings > Environment Variables
   - Add all required VITE_ prefixed variables

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configure environment variables**
   ```bash
   vercel env add VITE_ALCHEMY_API_KEY
   vercel env add VITE_PINATA_JWT
   # Add all other environment variables
   ```

## 🔧 Production Checklist

### Security
- [ ] Environment variables properly configured
- [ ] Private keys secured and not in code
- [ ] Smart contract audited
- [ ] HTTPS enabled
- [ ] CORS properly configured

### Performance
- [ ] Bundle size optimized
- [ ] Images compressed and optimized
- [ ] CDN configured for static assets
- [ ] Caching headers set
- [ ] Lighthouse score > 90

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Uptime monitoring
- [ ] Smart contract events monitoring

### Testing
- [ ] All tests passing
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified
- [ ] Wallet connection tested on multiple wallets

## 📊 Monitoring & Analytics

### Error Tracking with Sentry

1. **Install Sentry**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

2. **Configure Sentry**
   ```typescript
   // src/main.tsx
   import * as Sentry from "@sentry/react";
   
   Sentry.init({
     dsn: "YOUR_SENTRY_DSN",
     environment: "production",
   });
   ```

### Analytics Setup

1. **Google Analytics 4**
   ```html
   <!-- Add to index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
        env:
          VITE_ALCHEMY_API_KEY: ${{ secrets.VITE_ALCHEMY_API_KEY }}
          VITE_PINATA_JWT: ${{ secrets.VITE_PINATA_JWT }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔄 Updates & Maintenance

### Smart Contract Updates
- Deploy new contract versions
- Implement upgrade patterns (proxy contracts)
- Migrate data if necessary
- Update frontend contract addresses

### Frontend Updates
- Regular dependency updates
- Security patches
- Performance optimizations
- Feature additions

### Monitoring & Alerts
- Set up alerts for contract events
- Monitor gas usage and costs
- Track user engagement metrics
- Monitor error rates and performance

---

For additional support with deployment, please refer to our [documentation](https://docs.soulcred.app) or reach out to our team.