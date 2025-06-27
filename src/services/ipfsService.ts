import axios from 'axios';
import { IPFS_CONFIG } from '../config/blockchain';

export interface IPFSUploadResult {
  ipfsHash: string;
  pinataUrl: string;
  gatewayUrl: string;
}

export interface IPFSUploadOptions {
  name?: string;
  keyvalues?: Record<string, string>;
}

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretKey: string;
  private pinataJWT: string;
  private isConfigured: boolean;

  constructor() {
    this.pinataApiKey = IPFS_CONFIG.pinataApiKey || '';
    this.pinataSecretKey = IPFS_CONFIG.pinataSecretKey || '';
    this.pinataJWT = IPFS_CONFIG.pinataJWT || '';
    this.isConfigured = this.validateConfiguration();
  }

  private validateConfiguration(): boolean {
    return !!(this.pinataJWT && this.pinataJWT !== 'your_pinata_jwt_here');
  }

  /**
   * Check if IPFS service is properly configured
   */
  isReady(): boolean {
    return this.isConfigured;
  }

  /**
   * Upload file to IPFS via Pinata with retry logic
   */
  async uploadFile(file: File, options?: IPFSUploadOptions): Promise<IPFSUploadResult> {
    if (!this.isConfigured) {
      throw new Error('IPFS service not configured. Please set up Pinata credentials.');
    }

    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }

    // Check file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }

    const formData = new FormData();
    formData.append('file', file);

    if (options) {
      const metadata = {
        name: options.name || file.name,
        keyvalues: {
          ...options.keyvalues,
          uploadedAt: new Date().toISOString(),
          fileSize: file.size.toString(),
          fileType: file.type,
        }
      };
      formData.append('pinataMetadata', JSON.stringify(metadata));
    }

    // Add pinning options for better performance
    const pinataOptions = {
      cidVersion: 1,
      customPinPolicy: {
        regions: [
          { id: 'FRA1', desiredReplicationCount: 1 },
          { id: 'NYC1', desiredReplicationCount: 1 }
        ]
      }
    };
    formData.append('pinataOptions', JSON.stringify(pinataOptions));

    try {
      const response = await this.retryRequest(() =>
        axios.post(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${this.pinataJWT}`,
            },
            timeout: 60000, // 60 second timeout
          }
        )
      );

      const ipfsHash = response.data.IpfsHash;
      return {
        ipfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        gatewayUrl: `${IPFS_CONFIG.gateway}${ipfsHash}`,
      };
    } catch (error) {
      console.error('IPFS file upload error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid Pinata credentials');
        } else if (error.response?.status === 413) {
          throw new Error('File too large for upload');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Upload timeout - please try again');
        }
      }
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Upload JSON metadata to IPFS with validation
   */
  async uploadJSON(data: any, name?: string): Promise<IPFSUploadResult> {
    if (!this.isConfigured) {
      throw new Error('IPFS service not configured. Please set up Pinata credentials.');
    }

    // Validate JSON data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data provided');
    }

    try {
      // Ensure data is serializable
      JSON.stringify(data);
    } catch (error) {
      throw new Error('Data is not valid JSON');
    }

    const metadata = {
      name: name || `metadata-${Date.now()}`,
      keyvalues: {
        type: 'metadata',
        uploadedAt: new Date().toISOString(),
        dataType: 'json',
      }
    };

    const requestData = {
      pinataContent: data,
      pinataMetadata: metadata,
      pinataOptions: {
        cidVersion: 1,
        customPinPolicy: {
          regions: [
            { id: 'FRA1', desiredReplicationCount: 1 },
            { id: 'NYC1', desiredReplicationCount: 1 }
          ]
        }
      }
    };

    try {
      const response = await this.retryRequest(() =>
        axios.post(
          'https://api.pinata.cloud/pinning/pinJSONToIPFS',
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.pinataJWT}`,
            },
            timeout: 30000, // 30 second timeout
          }
        )
      );

      const ipfsHash = response.data.IpfsHash;
      return {
        ipfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        gatewayUrl: `${IPFS_CONFIG.gateway}${ipfsHash}`,
      };
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Invalid Pinata credentials');
        } else if (error.code === 'ECONNABORTED') {
          throw new Error('Upload timeout - please try again');
        }
      }
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  /**
   * Create NFT metadata following OpenSea standard with validation
   */
  createNFTMetadata(credentialData: any, imageUrl: string) {
    if (!credentialData.title) {
      throw new Error('Credential title is required');
    }

    if (!credentialData.description) {
      throw new Error('Credential description is required');
    }

    const metadata = {
      name: credentialData.title,
      description: credentialData.description,
      image: imageUrl,
      external_url: 'https://soulcred.app',
      animation_url: null,
      attributes: [
        {
          trait_type: 'Category',
          value: credentialData.category || 'General',
        },
        {
          trait_type: 'Learning Hours',
          value: credentialData.impactMetrics?.learningHours || 0,
          display_type: 'number',
        },
        {
          trait_type: 'Projects Completed',
          value: credentialData.impactMetrics?.projectsCompleted || 0,
          display_type: 'number',
        },
        {
          trait_type: 'Peers Helped',
          value: credentialData.impactMetrics?.peersHelped || 0,
          display_type: 'number',
        },
        {
          trait_type: 'Community Contributions',
          value: credentialData.impactMetrics?.communityContributions || 0,
          display_type: 'number',
        },
        {
          trait_type: 'Issuer',
          value: credentialData.issuer || 'Self-Issued',
        },
        {
          trait_type: 'Date Earned',
          value: new Date(credentialData.dateEarned || Date.now()).toISOString().split('T')[0],
          display_type: 'date',
        },
        {
          trait_type: 'Verified',
          value: credentialData.verified ? 'Yes' : 'No',
        },
      ],
      properties: {
        skills: credentialData.skills || [],
        evidence: credentialData.evidence || [],
        verified: credentialData.verified || false,
        soulbound: true,
        version: '1.0',
      },
    };

    // Add skill attributes
    if (credentialData.skills && Array.isArray(credentialData.skills)) {
      credentialData.skills.forEach((skill: string) => {
        metadata.attributes.push({
          trait_type: 'Skill',
          value: skill,
        });
      });
    }

    return metadata;
  }

  /**
   * Retry request with exponential backoff
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          break;
        }

        // Don't retry on authentication errors
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          break;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Get file from IPFS with fallback gateways
   */
  async getFile(ipfsHash: string): Promise<Blob> {
    const gateways = [
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      `https://ipfs.io/ipfs/${ipfsHash}`,
      `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
    ];

    let lastError: Error;

    for (const gateway of gateways) {
      try {
        const response = await axios.get(gateway, {
          responseType: 'blob',
          timeout: 10000,
        });
        return response.data;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Failed to fetch from gateway ${gateway}:`, error);
      }
    }

    throw new Error(`Failed to fetch file from IPFS: ${lastError!.message}`);
  }

  /**
   * Test IPFS connection
   */
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      const testData = { test: true, timestamp: Date.now() };
      await this.uploadJSON(testData, 'connection-test');
      return true;
    } catch (error) {
      console.error('IPFS connection test failed:', error);
      return false;
    }
  }
}

export const ipfsService = new IPFSService();