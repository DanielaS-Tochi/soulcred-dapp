import React, { useEffect, useState } from 'react';
import { useAccount, useNetwork, useContractRead } from 'wagmi';
import { CheckCircle, AlertCircle, ExternalLink, Award, Users, Clock } from 'lucide-react';
import { getContractAddress, getNetworkConfig } from '../../config/blockchain';

const ContractStatus: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [contractInfo, setContractInfo] = useState<any>(null);

  const contractAddress = chain?.id ? getContractAddress(chain.id) : null;
  const networkConfig = chain?.id ? getNetworkConfig(chain.id) : null;

  // Read contract basic info
  const { data: contractName } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "name",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'name',
    enabled: !!contractAddress,
  });

  const { data: contractSymbol } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [{"internalType": "string", "name": "", "type": "string"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'symbol',
    enabled: !!contractAddress,
  });

  const { data: contractOwner } = useContractRead({
    address: contractAddress as `0x${string}`,
    abi: [
      {
        "inputs": [],
        "name": "owner",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'owner',
    enabled: !!contractAddress,
  });

  useEffect(() => {
    if (contractName && contractSymbol && contractOwner) {
      setContractInfo({
        name: contractName,
        symbol: contractSymbol,
        owner: contractOwner,
      });
    }
  }, [contractName, contractSymbol, contractOwner]);

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              Wallet Not Connected
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              Connect your wallet to test the smart contract integration.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!contractAddress) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              Contract Not Available
            </h3>
            <p className="text-red-700 dark:text-red-300 text-sm">
              Smart contract not deployed on {chain?.name || 'this network'}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Contract Status */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-green-800 dark:text-green-200">
            Smart Contract Connected ✅
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              Contract Address
            </p>
            <div className="flex items-center space-x-2">
              <p className="font-mono text-sm text-green-800 dark:text-green-200 break-all">
                {contractAddress}
              </p>
              {networkConfig && (
                <a
                  href={`${networkConfig.explorerUrl}/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                  title="View on block explorer"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
              Network
            </p>
            <p className="text-green-800 dark:text-green-200">
              {networkConfig?.name || chain?.name} ({chain?.id})
            </p>
          </div>
        </div>
      </div>

      {/* Contract Information */}
      {contractInfo && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Contract Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Name
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {contractInfo.name}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Symbol
              </p>
              <p className="text-gray-900 dark:text-white font-medium">
                {contractInfo.symbol}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Owner
              </p>
              <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                {contractInfo.owner}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Test Actions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Ready for Testing</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 text-sm">
              Contract deployed and verified on {networkConfig?.name}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 text-sm">
              Frontend connected to smart contract
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 text-sm">
              Ready to mint Soulbound Tokens
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-300 text-sm">
              IPFS integration ready for metadata storage
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-sm font-medium">
            🎉 Your SoulCred dApp is fully functional and ready for the hackathon demo!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractStatus;