import axios from 'axios';
import { IPFS_CONFIG } from '../config/blockchain';

export interface IPFSUploadResult {
  ipfsHash: string;
  pinataUrl: string;
  gatewayUrl: string;
}

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretKey: string;
  private pinataJWT: string;

  constructor() {
    this.pinataApiKey = IPFS_CONFIG.pinataApiKey || '';
    this.pinataSecretKey = IPFS_CONFIG.pinataSecretKey || '';
    this.pinataJWT = IPFS_CONFIG.pinataJWT || '';
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(file: File, metadata?: any): Promise<IPFSUploadResult> {
    if (!this.pinataJWT) {
      throw new Error('Pinata JWT not configured');
    }

    const formData = new FormData();
    formData.append('file', file);

    if (metadata) {
      formData.append('pinataMetadata', JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: metadata.keyvalues || {}
      }));
    }

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${this.pinataJWT}`,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      return {
        ipfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        gatewayUrl: `${IPFS_CONFIG.gateway}${ipfsHash}`,
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Upload JSON metadata to IPFS
   */
  async uploadJSON(data: any, name?: string): Promise<IPFSUploadResult> {
    if (!this.pinataJWT) {
      throw new Error('Pinata JWT not configured');
    }

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.pinataJWT}`,
          },
        }
      );

      const ipfsHash = response.data.IpfsHash;
      return {
        ipfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        gatewayUrl: `${IPFS_CONFIG.gateway}${ipfsHash}`,
      };
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  /**
   * Create NFT metadata following OpenSea standard
   */
  createNFTMetadata(credentialData: any, imageUrl: string) {
    return {
      name: credentialData.title,
      description: credentialData.description,
      image: imageUrl,
      external_url: 'https://soulcred.app',
      attributes: [
        {
          trait_type: 'Category',
          value: credentialData.category,
        },
        {
          trait_type: 'Learning Hours',
          value: credentialData.impactMetrics.learningHours,
          display_type: 'number',
        },
        {
          trait_type: 'Projects Completed',
          value: credentialData.impactMetrics.projectsCompleted,
          display_type: 'number',
        },
        {
          trait_type: 'Peers Helped',
          value: credentialData.impactMetrics.peersHelped,
          display_type: 'number',
        },
        {
          trait_type: 'Community Contributions',
          value: credentialData.impactMetrics.communityContributions,
          display_type: 'number',
        },
        {
          trait_type: 'Issuer',
          value: credentialData.issuer || 'Self-Issued',
        },
        {
          trait_type: 'Date Earned',
          value: new Date(credentialData.dateEarned || Date.now()).toISOString().split('T')[0],
        },
        ...credentialData.skills.map((skill: string) => ({
          trait_type: 'Skill',
          value: skill,
        })),
      ],
      properties: {
        skills: credentialData.skills,
        evidence: credentialData.evidence,
        verified: credentialData.verified || false,
      },
    };
  }
}

export const ipfsService = new IPFSService();