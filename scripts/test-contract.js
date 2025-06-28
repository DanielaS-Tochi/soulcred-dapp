const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.log("❌ Please provide contract address as argument");
    console.log("Usage: npx hardhat run scripts/test-contract.js --network sepolia <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("🧪 Testing deployed contract at:", contractAddress);

  // Get contract instance
  const SoulCredSBT = await ethers.getContractFactory("SoulCredSBT");
  const contract = SoulCredSBT.attach(contractAddress);
  
  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("👤 Testing with account:", signer.address);

  try {
    // Test basic contract info
    console.log("\n📋 Contract Information:");
    const name = await contract.name();
    const symbol = await contract.symbol();
    const owner = await contract.owner();
    
    console.log("✅ Name:", name);
    console.log("✅ Symbol:", symbol);
    console.log("✅ Owner:", owner);

    // Test minting a credential
    console.log("\n🎖️ Testing credential minting...");
    
    const credentialData = {
      title: "Test Credential",
      category: "Testing",
      description: "A test credential for contract verification",
      skills: ["Testing", "Smart Contracts"],
      learningHours: 10,
      projectsCompleted: 1,
      peersHelped: 0,
      communityContributions: 1,
      dateEarned: Math.floor(Date.now() / 1000),
      issuer: "SoulCred Test",
      verified: false,
      recipient: signer.address,
    };

    const tokenURI = "https://gateway.pinata.cloud/ipfs/QmTestHash";

    console.log("⏳ Minting test credential...");
    const tx = await contract.mintCredential(
      signer.address,
      tokenURI,
      credentialData,
      { gasLimit: 500000 }
    );

    console.log("📝 Transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

    // Get the token ID from the event
    const event = receipt.events?.find(e => e.event === 'CredentialMinted');
    if (event) {
      const tokenId = event.args?.tokenId;
      console.log("🎯 Minted Token ID:", tokenId.toString());

      // Test reading the credential
      console.log("\n📖 Reading credential data...");
      const storedCredential = await contract.getCredential(tokenId);
      console.log("✅ Title:", storedCredential.title);
      console.log("✅ Category:", storedCredential.category);
      console.log("✅ Skills:", storedCredential.skills);

      // Test user credentials
      const userCredentials = await contract.getUserCredentials(signer.address);
      console.log("✅ User has", userCredentials.length, "credential(s)");
    }

    console.log("\n🎉 All tests passed! Contract is working correctly.");

  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.reason) {
      console.error("Reason:", error.reason);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });