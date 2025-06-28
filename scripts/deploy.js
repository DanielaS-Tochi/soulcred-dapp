const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting SoulCred Smart Contract Deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Check balance
  const balance = await deployer.getBalance();
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH\n");

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.log("⚠️  WARNING: Low balance! You might need more ETH for deployment.");
    console.log("   Get testnet ETH from: https://sepoliafaucet.com/\n");
  }

  // Deploy SoulCredSBT contract
  console.log("📦 Deploying SoulCredSBT contract...");
  const SoulCredSBT = await ethers.getContractFactory("SoulCredSBT");
  
  // Estimate gas
  const deploymentData = SoulCredSBT.interface.encodeDeploy([]);
  const estimatedGas = await ethers.provider.estimateGas({
    data: deploymentData,
  });
  console.log("⛽ Estimated gas:", estimatedGas.toString());

  // Deploy with gas limit
  const soulCredSBT = await SoulCredSBT.deploy({
    gasLimit: estimatedGas.mul(120).div(100), // Add 20% buffer
  });

  console.log("⏳ Waiting for deployment transaction...");
  await soulCredSBT.deployed();

  console.log("\n🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=" .repeat(50));
  console.log("📍 Contract Address:", soulCredSBT.address);
  console.log("🔗 Transaction Hash:", soulCredSBT.deployTransaction.hash);
  console.log("⛽ Gas Used:", soulCredSBT.deployTransaction.gasLimit?.toString());
  console.log("💰 Deployment Cost:", ethers.utils.formatEther(
    soulCredSBT.deployTransaction.gasLimit?.mul(soulCredSBT.deployTransaction.gasPrice || 0) || 0
  ), "ETH");

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);
  
  // Block explorer links
  const explorerUrls = {
    11155111: "https://sepolia.etherscan.io", // Sepolia
    5: "https://goerli.etherscan.io", // Goerli
    80001: "https://mumbai.polygonscan.com", // Mumbai
  };
  
  const explorerUrl = explorerUrls[network.chainId];
  if (explorerUrl) {
    console.log("🔍 View on Explorer:", `${explorerUrl}/address/${soulCredSBT.address}`);
    console.log("📋 Transaction:", `${explorerUrl}/tx/${soulCredSBT.deployTransaction.hash}`);
  }

  console.log("=" .repeat(50));

  // Test basic functionality
  console.log("\n🧪 Testing basic contract functionality...");
  try {
    const name = await soulCredSBT.name();
    const symbol = await soulCredSBT.symbol();
    const owner = await soulCredSBT.owner();
    
    console.log("✅ Contract Name:", name);
    console.log("✅ Contract Symbol:", symbol);
    console.log("✅ Contract Owner:", owner);
    console.log("✅ All basic functions working!");
  } catch (error) {
    console.log("❌ Error testing contract:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    contractAddress: soulCredSBT.address,
    transactionHash: soulCredSBT.deployTransaction.hash,
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    explorerUrl: explorerUrl ? `${explorerUrl}/address/${soulCredSBT.address}` : null,
  };

  console.log("\n📄 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Instructions for next steps
  console.log("\n📋 NEXT STEPS:");
  console.log("1. Update src/config/blockchain.ts with the contract address");
  console.log("2. Verify the contract on Etherscan (optional)");
  console.log("3. Test the dApp with the deployed contract");
  console.log("4. Create demo credentials for the hackathon");

  if (explorerUrl) {
    console.log("\n🔍 VERIFICATION COMMAND:");
    console.log(`npx hardhat verify --network ${network.name.toLowerCase()} ${soulCredSBT.address}`);
  }

  return deploymentInfo;
}

main()
  .then((deploymentInfo) => {
    console.log("\n🎊 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });