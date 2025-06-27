import { useContractRead, useContractWrite, useAccount, useNetwork } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../config/blockchain';

// ABI for the SoulCredSBT contract (simplified)
const SOULCRED_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "string", "name": "tokenURI", "type": "string"},
      {"internalType": "tuple", "name": "credentialData", "type": "tuple", "components": [
        {"internalType": "string", "name": "title", "type": "string"},
        {"internalType": "string", "name": "category", "type": "string"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "string[]", "name": "skills", "type": "string[]"},
        {"internalType": "uint256", "name": "learningHours", "type": "uint256"},
        {"internalType": "uint256", "name": "projectsCompleted", "type": "uint256"},
        {"internalType": "uint256", "name": "peersHelped", "type": "uint256"},
        {"internalType": "uint256", "name": "communityContributions", "type": "uint256"},
        {"internalType": "uint256", "name": "dateEarned", "type": "uint256"},
        {"internalType": "string", "name": "issuer", "type": "string"},
        {"internalType": "bool", "name": "verified", "type": "bool"},
        {"internalType": "address", "name": "recipient", "type": "address"}
      ]}
    ],
    "name": "mintCredential",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "endorseCredential",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserCredentials",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getCredential",
    "outputs": [{"internalType": "tuple", "name": "", "type": "tuple", "components": [
      {"internalType": "string", "name": "title", "type": "string"},
      {"internalType": "string", "name": "category", "type": "string"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string[]", "name": "skills", "type": "string[]"},
      {"internalType": "uint256", "name": "learningHours", "type": "uint256"},
      {"internalType": "uint256", "name": "projectsCompleted", "type": "uint256"},
      {"internalType": "uint256", "name": "peersHelped", "type": "uint256"},
      {"internalType": "uint256", "name": "communityContributions", "type": "uint256"},
      {"internalType": "uint256", "name": "dateEarned", "type": "uint256"},
      {"internalType": "string", "name": "issuer", "type": "string"},
      {"internalType": "bool", "name": "verified", "type": "bool"},
      {"internalType": "address", "name": "recipient", "type": "address"}
    ]}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "endorsementCounts",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export function useSoulCredContract() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const contractAddress = chain?.id ? CONTRACT_ADDRESSES[chain.id as keyof typeof CONTRACT_ADDRESSES] : undefined;

  // Hook for reading user credentials
  const { data: userCredentials, refetch: refetchUserCredentials } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: SOULCRED_ABI,
    functionName: 'getUserCredentials',
    args: [address],
    enabled: !!contractAddress && !!address,
  });

  // Hook for minting credentials
  const { write: mintCredential, isLoading: isMinting } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: SOULCRED_ABI,
    functionName: 'mintCredential',
  });

  // Hook for endorsing credentials
  const { write: endorseCredential, isLoading: isEndorsing } = useContractWrite({
    address: contractAddress as `0x${string}`,
    abi: SOULCRED_ABI,
    functionName: 'endorseCredential',
  });

  // Function to read a specific credential
  const readCredential = (tokenId: number) => {
    return useContractRead({
      address: contractAddress as `0x${string}`,
      abi: SOULCRED_ABI,
      functionName: 'getCredential',
      args: [tokenId],
      enabled: !!contractAddress && tokenId !== undefined,
    });
  };

  // Function to read endorsement count
  const readEndorsementCount = (tokenId: number) => {
    return useContractRead({
      address: contractAddress as `0x${string}`,
      abi: SOULCRED_ABI,
      functionName: 'endorsementCounts',
      args: [tokenId],
      enabled: !!contractAddress && tokenId !== undefined,
    });
  };

  return {
    contractAddress,
    isContractReady: !!contractAddress,
    userCredentials,
    refetchUserCredentials,
    mintCredential,
    isMinting,
    endorseCredential,
    isEndorsing,
    readCredential,
    readEndorsementCount,
    abi: SOULCRED_ABI,
  };
}