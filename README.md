# SoulCred - Decentralized Credential Platform

![SoulCred Logo](https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600&h=400)

SoulCred is a decentralized platform for issuing and managing Soulbound Tokens (SBTs) that represent learning achievements and community contributions. Built with React, TypeScript, and Web3 technologies, it provides a secure, transparent, and permanent way to showcase your skills and accomplishments.

## 🌟 Features

### Core Functionality
- **Soulbound Token Minting**: Create permanent, non-transferable credentials on the blockchain
- **Decentralized Storage**: Evidence and metadata stored on IPFS for permanence and accessibility
- **Real Blockchain Integration**: Deploy on Ethereum testnets (Sepolia, Goerli) and Polygon Mumbai
- **Peer Endorsement System**: Community-driven verification and reputation building
- **Dynamic Data Visualization**: Interactive charts showing learning progress and achievements

### User Experience
- **Wallet Integration**: Seamless connection with MetaMask and other Web3 wallets
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **File Upload**: Drag-and-drop evidence upload with IPFS integration
- **Real-time Updates**: Live blockchain transaction status and confirmations

### Technical Features
- **Smart Contract Integration**: Custom SBT contract with endorsement functionality
- **IPFS Integration**: Decentralized file storage via Pinata
- **Web3 Wallet Support**: RainbowKit integration for multiple wallet options
- **TypeScript**: Full type safety and developer experience
- **Modern UI**: Tailwind CSS with custom components and animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/soulcred.git
   cd soulcred
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys:
   - **Alchemy/Infura**: For blockchain RPC access
   - **WalletConnect**: For wallet connection
   - **Pinata**: For IPFS storage

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Blockchain Configuration
VITE_ALCHEMY_API_KEY=your_alchemy_api_key_here
VITE_INFURA_API_KEY=your_infura_api_key_here
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# IPFS Configuration (Pinata)
VITE_PINATA_API_KEY=your_pinata_api_key_here
VITE_PINATA_SECRET_KEY=your_pinata_secret_key_here
VITE_PINATA_JWT=your_pinata_jwt_here
```

### Getting API Keys

1. **Alchemy**: Sign up at [alchemy.com](https://alchemy.com) and create an app
2. **Infura**: Register at [infura.io](https://infura.io) and create a project
3. **WalletConnect**: Get a project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)
4. **Pinata**: Create account at [pinata.cloud](https://pinata.cloud) and generate API keys

## 📱 Usage Guide

### 1. Connect Your Wallet
- Click "Connect Wallet" on the welcome screen
- Choose your preferred wallet (MetaMask recommended)
- Approve the connection request

### 2. Mint Your First Credential
- Navigate to "Mint Credential" in the header
- Fill out the 4-step form:
  - **Basic Info**: Title, category, description
  - **Skills & Evidence**: Add skills and upload proof files
  - **Impact Metrics**: Quantify your achievement
  - **Review & Mint**: Confirm and create your SBT

### 3. Explore Your Dashboard
- View learning progress charts
- See achievement timeline
- Track impact metrics
- Browse your credential collection

### 4. Engage with Community
- Browse other users' achievements
- Endorse credentials you find valuable
- Discover new learning opportunities
- Build your reputation score

## 🏗️ Architecture

### Smart Contract
```solidity
// SoulCredSBT.sol - Main contract for SBT functionality
contract SoulCredSBT is ERC721, ERC721URIStorage, Ownable {
    // Soulbound token implementation
    // Credential data storage
    // Endorsement system
    // Recovery mechanisms
}
```

### Frontend Stack
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Full type safety and IntelliSense
- **Tailwind CSS**: Utility-first styling with custom design system
- **Wagmi**: React hooks for Ethereum
- **RainbowKit**: Wallet connection UI
- **Recharts**: Data visualization components
- **React Dropzone**: File upload functionality

### Web3 Integration
- **Ethers.js**: Ethereum library for contract interaction
- **IPFS**: Decentralized storage via Pinata
- **MetaMask**: Primary wallet integration
- **Multiple Networks**: Sepolia, Goerli, Polygon Mumbai support

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- Smart contract functionality
- IPFS upload/retrieval
- Wallet connection flows
- UI component interactions
- Form validation logic

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
```bash
npm run deploy
```

### Smart Contract Deployment
1. Compile contracts: `npx hardhat compile`
2. Deploy to testnet: `npx hardhat run scripts/deploy.js --network sepolia`
3. Update contract addresses in `src/config/blockchain.ts`
4. Verify on Etherscan: `npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow the existing code style
- Add tests for new functionality
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin**: Smart contract security standards
- **Ethereum Foundation**: Blockchain infrastructure
- **IPFS**: Decentralized storage protocol
- **Tailwind CSS**: Utility-first CSS framework
- **React Team**: Modern frontend framework

## 📞 Support

- **Documentation**: [docs.soulcred.app](https://docs.soulcred.app)
- **Discord**: [Join our community](https://discord.gg/soulcred)
- **Twitter**: [@SoulCredApp](https://twitter.com/SoulCredApp)
- **Email**: support@soulcred.app

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic SBT minting
- ✅ IPFS integration
- ✅ Wallet connection
- ✅ Responsive UI

### Phase 2 (Next)
- 🔄 Multi-chain deployment
- 🔄 Advanced endorsement system
- 🔄 Credential verification API
- 🔄 Mobile app development

### Phase 3 (Future)
- 📋 DAO governance
- 📋 Credential marketplace
- 📋 Integration partnerships
- 📋 Enterprise solutions

---

**Built with ❤️ by the SoulCred team**

*Empowering learners through decentralized credentials*