# 🚀 SoulCred Smart Contract Deployment Guide

This guide will walk you through deploying the SoulCred smart contracts to Sepolia testnet for the hackathon demo.

## 📋 Prerequisites

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Get Required API Keys**

#### 🔗 **Alchemy API Key** (Recommended)
1. Go to [alchemy.com](https://alchemy.com)
2. Create a free account
3. Create a new app for "Ethereum Sepolia"
4. Copy the API key

#### 🔍 **Etherscan API Key** (For verification)
1. Go to [etherscan.io](https://etherscan.io)
2. Create a free account
3. Go to API Keys section
4. Create a new API key

### 3. **Get Test ETH**
1. Go to [Sepolia Faucet](https://sepoliafaucet.com/)
2. Enter your wallet address
3. Get free test ETH (you need ~0.01 ETH for deployment)

### 4. **Export Private Key**
⚠️ **SECURITY WARNING**: Only use a test wallet for deployment!

**From MetaMask:**
1. Click on account menu → Account Details
2. Click "Export Private Key"
3. Enter your password
4. Copy the private key (starts with 0x)

## ⚙️ Configuration

### 1. **Create Environment File**
```bash
cp .env.example .env
```

### 2. **Fill in Your Environment Variables**
Edit `.env` file:
```env
# Required for deployment
ALCHEMY_API_KEY=your_alchemy_api_key_here
PRIVATE_KEY=your_private_key_here

# Optional for verification
ETHERSCAN_API_KEY=your_etherscan_api_key_here

# For frontend (if different from above)
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
```

## 🚀 Deployment Steps

### 1. **Compile Contracts**
```bash
npm run hardhat:compile
```

### 2. **Deploy to Sepolia**
```bash
npm run hardhat:deploy:sepolia
```

**Expected Output:**
```
🚀 Starting SoulCred Smart Contract Deployment...

📝 Deploying contracts with account: 0x...
💰 Account balance: 0.05 ETH

📦 Deploying SoulCredSBT contract...
⏳ Waiting for deployment transaction...

🎉 DEPLOYMENT SUCCESSFUL!
==================================================
📍 Contract Address: 0x742d35Cc6634C0532925a3b8D1D8E9C7b5F6E123
🔗 Transaction Hash: 0x...
🌐 Network: sepolia (Chain ID: 11155111)
🔍 View on Explorer: https://sepolia.etherscan.io/address/0x...
==================================================
```

### 3. **Test the Deployed Contract**
```bash
npm run hardhat:test-contract 0x742d35Cc6634C0532925a3b8D1D8E9C7b5F6E123
```

### 4. **Verify on Etherscan** (Optional)
```bash
npm run hardhat:verify 0x742d35Cc6634C0532925a3b8D1D8E9C7b5F6E123
```

## 🔧 Update Frontend Configuration

After successful deployment, update the contract address in your frontend:

**Edit `src/config/blockchain.ts`:**
```typescript
export const CONTRACT_ADDRESSES = {
  [sepolia.id]: '0x742d35Cc6634C0532925a3b8D1D8E9C7b5F6E123', // Your deployed address
  [polygonMumbai.id]: null,
  [goerli.id]: null,
} as const;
```

## 🧪 Testing Your Deployment

### 1. **Test in Frontend**
1. Start your development server: `npm run dev`
2. Connect your wallet to Sepolia network
3. Try minting a test credential
4. Verify the transaction on Etherscan

### 2. **Create Demo Credentials**
For your hackathon presentation, create some impressive demo credentials:

- **"Advanced React Development"** - Programming category
- **"Smart Contract Security Audit"** - Blockchain category  
- **"Community Leadership Excellence"** - Leadership category

## 🎯 Hackathon Demo Tips

### **Live Demo Script:**
1. **Show the deployed contract** on Etherscan
2. **Connect wallet** to Sepolia testnet
3. **Mint a credential live** during presentation
4. **Show IPFS storage** of evidence files
5. **Demonstrate endorsements** from other accounts
6. **View transaction** on block explorer

### **Backup Plan:**
- Have pre-minted credentials ready
- Test everything beforehand
- Have screenshots as backup

## 🚨 Troubleshooting

### **Common Issues:**

#### **"Insufficient funds for gas"**
- Get more test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

#### **"Network not supported"**
- Make sure you're on Sepolia testnet in MetaMask

#### **"Private key error"**
- Ensure private key starts with 0x
- Use a test wallet only

#### **"Contract verification failed"**
- Wait a few minutes after deployment
- Try verification again

### **Get Help:**
- Check transaction on [Sepolia Etherscan](https://sepolia.etherscan.io)
- Verify network settings in MetaMask
- Ensure sufficient test ETH balance

## 🎊 Success Checklist

- ✅ Contract deployed to Sepolia
- ✅ Contract verified on Etherscan  
- ✅ Frontend updated with contract address
- ✅ Test credential minted successfully
- ✅ Demo credentials prepared
- ✅ Live demo script ready

**You're ready for the hackathon! 🚀**