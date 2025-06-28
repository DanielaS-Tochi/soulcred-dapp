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
  private pinataJWT: string;
  private isConfigured: boolean;

  constructor() {
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
   * Upload file to IPFS via Netlify Function (no expone JWT)
   */
  async uploadFile(file: File, options?: IPFSUploadOptions): Promise<IPFSUploadResult> {
    // Validaciones locales
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }

    // Prepara metadata si es necesario
    let metadata = undefined;
    if (options) {
      metadata = {
        name: options.name || file.name,
        keyvalues: {
          ...options.keyvalues,
          uploadedAt: new Date().toISOString(),
          fileSize: file.size.toString(),
          fileType: file.type,
        }
      };
    }

    // Lee el archivo como base64 y llama a la función serverless
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const response = await fetch('/.netlify/functions/uploadToPinata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file: base64,
              fileName: file.name,
              metadata,
            }),
          });
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to upload file to IPFS');
          }
          const data = await response.json();
          // Ajusta el resultado para que coincida con IPFSUploadResult
          resolve({
            ipfsHash: data.IpfsHash || data.ipfsHash,
            pinataUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash || data.ipfsHash}`,
            gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash || data.ipfsHash}`,
          });
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload JSON metadata to IPFS via Netlify Function (no expone JWT)
   */
  async uploadJSON(data: any, name?: string): Promise<IPFSUploadResult> {
    // Validaciones locales
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

    try {
      const response = await fetch('/.netlify/functions/uploadToPinata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          json: data,
          metadata,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload JSON to IPFS');
      }
      const result = await response.json();
      return {
        ipfsHash: result.IpfsHash || result.ipfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash || result.ipfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash || result.ipfsHash}`,
      };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to upload JSON to IPFS');
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