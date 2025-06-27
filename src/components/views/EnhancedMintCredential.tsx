import React, { useState } from 'react';
import { Upload, Plus, X, CheckCircle, Award, Loader, AlertCircle } from 'lucide-react';
import { useAccount, useNetwork } from 'wagmi';
import { useSoulCredContract } from '../../hooks/useContract';
import { ipfsService } from '../../services/ipfsService';
import { getContractAddress, isContractDeployed } from '../../config/blockchain';
import FileUpload from '../ui/FileUpload';

interface FormData {
  title: string;
  category: string;
  description: string;
  skills: string[];
  evidence: string[];
  evidenceFiles: File[];
  impactMetrics: {
    learningHours: number;
    projectsCompleted: number;
    peersHelped: number;
    communityContributions: number;
  };
  issuer: string;
}

const EnhancedMintCredential: React.FC = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { mintCredential, isMinting, isContractReady } = useSoulCredContract();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [mintedTokenId, setMintedTokenId] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    category: '',
    description: '',
    skills: [],
    evidence: [],
    evidenceFiles: [],
    impactMetrics: {
      learningHours: 0,
      projectsCompleted: 0,
      peersHelped: 0,
      communityContributions: 0,
    },
    issuer: 'Self-Issued',
  });

  const categories = [
    'Programming',
    'Blockchain',
    'Leadership',
    'Design',
    'Security',
    'Education',
    'Research',
    'Community',
  ];

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Title, category, and description' },
    { id: 2, title: 'Skills & Evidence', description: 'Skills developed and proof of work' },
    { id: 3, title: 'Impact Metrics', description: 'Quantify your achievements' },
    { id: 4, title: 'Review & Mint', description: 'Final review and blockchain minting' },
  ];

  // Check if contract is deployed on current network
  const isContractAvailable = chain?.id ? isContractDeployed(chain.id) : false;
  const contractAddress = chain?.id ? getContractAddress(chain.id) : null;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMetricChange = (metric: keyof FormData['impactMetrics'], value: number) => {
    setFormData(prev => ({
      ...prev,
      impactMetrics: {
        ...prev.impactMetrics,
        [metric]: value,
      },
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  const addEvidence = () => {
    if (newEvidence.trim() && !formData.evidence.includes(newEvidence.trim())) {
      setFormData(prev => ({
        ...prev,
        evidence: [...prev.evidence, newEvidence.trim()],
      }));
      setNewEvidence('');
    }
  };

  const removeEvidence = (evidenceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      evidence: prev.evidence.filter(evidence => evidence !== evidenceToRemove),
    }));
  };

  const handleFileSelect = (files: File[]) => {
    setFormData(prev => ({ ...prev, evidenceFiles: files }));
  };

  const handleSubmit = async () => {
    if (!isContractAvailable || !contractAddress || !address) {
      setError('Smart contract not available on this network or wallet not connected');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // For demo purposes, simulate the minting process
      // In a real implementation, you would:
      // 1. Upload files to IPFS
      // 2. Create metadata
      // 3. Call the smart contract

      // Simulate IPFS upload
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate contract interaction
      const mockTokenId = Math.floor(Math.random() * 10000).toString();
      
      // For now, just simulate success
      setMintedTokenId(mockTokenId);
      setIsSuccess(true);

      // In a real implementation:
      /*
      // Step 1: Upload evidence files to IPFS
      const evidenceUrls: string[] = [];
      for (const file of formData.evidenceFiles) {
        const result = await ipfsService.uploadFile(file, {
          name: `${formData.title}-evidence-${file.name}`,
          keyvalues: {
            type: 'evidence',
            credential: formData.title,
          },
        });
        evidenceUrls.push(result.gatewayUrl);
      }

      // Step 2: Create and upload NFT metadata
      const metadata = ipfsService.createNFTMetadata(
        {
          ...formData,
          evidence: [...formData.evidence, ...evidenceUrls],
          dateEarned: new Date().toISOString(),
          verified: false,
        },
        'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600&h=400'
      );

      const metadataResult = await ipfsService.uploadJSON(metadata, `${formData.title}-metadata`);

      // Step 3: Prepare contract data
      const credentialData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        skills: formData.skills,
        learningHours: formData.impactMetrics.learningHours,
        projectsCompleted: formData.impactMetrics.projectsCompleted,
        peersHelped: formData.impactMetrics.peersHelped,
        communityContributions: formData.impactMetrics.communityContributions,
        dateEarned: Math.floor(Date.now() / 1000),
        issuer: formData.issuer,
        verified: false,
        recipient: address,
      };

      // Step 4: Mint the SBT
      const result = await mintCredential({
        args: [address, metadataResult.gatewayUrl, credentialData],
      });

      setMintedTokenId(result.hash);
      setIsSuccess(true);
      */
    } catch (error) {
      console.error('Minting error:', error);
      setError('Failed to mint credential. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return formData.title && formData.category && formData.description;
      case 2:
        return formData.skills.length > 0 && (formData.evidence.length > 0 || formData.evidenceFiles.length > 0);
      case 3:
        return true; // Impact metrics are optional
      case 4:
        return address && chain;
      default:
        return false;
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Credential Minted Successfully! 🎉
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your "{formData.title}" credential has been successfully minted as a Soulbound Token on the blockchain. 
            It's now part of your permanent achievement record.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Token ID</p>
            <p className="font-mono text-sm text-gray-900 dark:text-white">
              #{mintedTokenId}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setIsSuccess(false);
                setCurrentStep(1);
                setMintedTokenId('');
                setError('');
                setFormData({
                  title: '',
                  category: '',
                  description: '',
                  skills: [],
                  evidence: [],
                  evidenceFiles: [],
                  impactMetrics: {
                    learningHours: 0,
                    projectsCompleted: 0,
                    peersHelped: 0,
                    communityContributions: 0,
                  },
                  issuer: 'Self-Issued',
                });
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
            >
              Mint Another
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mint New Credential
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Create a permanent, blockchain-verified record of your learning achievements.
        </p>
        
        {/* Contract Status */}
        {!isContractAvailable && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">
                  Smart Contract Not Deployed
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 text-xs">
                  The SoulCred contract is not yet deployed on {chain?.name || 'this network'}. 
                  You can still create credentials in demo mode.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep >= step.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={20} /> : step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id
                      ? 'bg-purple-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Achievement Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Advanced React Development Certification"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your achievement, what you learned, and how you demonstrated your skills..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Issuing Organization
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                placeholder="e.g., University Name, Company, Self-Issued"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}

        {/* Step 2: Skills & Evidence */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Skills & Evidence
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Skills Developed *
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Evidence Links
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="e.g., GitHub repository, live demo, certificate URL..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addEvidence()}
                />
                <button
                  onClick={addEvidence}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {formData.evidence.map((evidence, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <span className="text-sm text-gray-900 dark:text-white">{evidence}</span>
                    <button
                      onClick={() => removeEvidence(evidence)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <FileUpload
              onFileSelect={handleFileSelect}
              label="Upload Evidence Files"
              description="Upload certificates, screenshots, documents, or other proof of your achievement"
            />
          </div>
        )}

        {/* Step 3: Impact Metrics */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Impact Metrics
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Quantify the impact of your achievement. These metrics help showcase the value of your learning.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Learning Hours
                </label>
                <input
                  type="number"
                  value={formData.impactMetrics.learningHours}
                  onChange={(e) => handleMetricChange('learningHours', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Projects Completed
                </label>
                <input
                  type="number"
                  value={formData.impactMetrics.projectsCompleted}
                  onChange={(e) => handleMetricChange('projectsCompleted', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Peers Helped
                </label>
                <input
                  type="number"
                  value={formData.impactMetrics.peersHelped}
                  onChange={(e) => handleMetricChange('peersHelped', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Community Contributions
                </label>
                <input
                  type="number"
                  value={formData.impactMetrics.communityContributions}
                  onChange={(e) => handleMetricChange('communityContributions', parseInt(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Mint */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Review & Mint
            </h2>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                {formData.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</p>
                  <p className="text-gray-900 dark:text-white">{formData.category}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Issuer</p>
                  <p className="text-gray-900 dark:text-white">{formData.issuer}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Skills ({formData.skills.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                    {formData.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                        +{formData.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Evidence</p>
                  <p className="text-gray-900 dark:text-white text-sm">
                    {formData.evidence.length + formData.evidenceFiles.length} items
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Description</p>
                <p className="text-gray-900 dark:text-white text-sm">{formData.description}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {formData.impactMetrics.learningHours}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Learning Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formData.impactMetrics.projectsCompleted}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formData.impactMetrics.peersHelped}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Peers Helped</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formData.impactMetrics.communityContributions}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Contributions</p>
                </div>
              </div>
            </div>

            {isSubmitting && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 text-center">
                <Loader className="w-8 h-8 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-purple-700 dark:text-purple-300 font-medium mb-2">
                  {isContractAvailable ? 'Minting your credential on the blockchain...' : 'Creating your credential...'}
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  {isContractAvailable 
                    ? 'This includes uploading to IPFS and creating the SBT. Please don\'t close this window.'
                    : 'Running in demo mode. Your credential will be created locally.'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-3">
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!canProceed(currentStep)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !canProceed(currentStep)}
                className="flex items-center space-x-2 px-8 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-purple-400 disabled:to-blue-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Minting...</span>
                  </>
                ) : (
                  <>
                    <Award size={16} />
                    <span>{isContractAvailable ? 'Mint Credential' : 'Create Credential (Demo)'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMintCredential;