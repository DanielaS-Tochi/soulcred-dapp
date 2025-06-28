import axios from 'axios';

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
  constructor() {
    // No sensitive configuration stored client-side
  }

  /**
   * Check if IPFS service is available
   */
  isReady(): boolean {
    // Always return true - actual validation happens server-side
    return true;
  }

  /**
   * Upload file to IPFS via Netlify Function
   */
  async uploadFile(file: File, options?: IPFSUploadOptions): Promise<IPFSUploadResult> {
    // Validate file
    if (!file || file.size === 0) {
      throw new Error('Invalid file provided');
    }
    
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 100MB limit');
    }

    // Prepare metadata
    const metadata = {
      name: options?.name || file.name,
      keyvalues: {
        ...options?.keyvalues,
        uploadedAt: new Date().toISOString(),
        fileSize: file.size.toString(),
        fileType: file.type,
        source: 'soulcred-dapp',
      }
    };

    // Convert file to base64 and upload via Netlify function
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
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          
          resolve({
            ipfsHash: data.IpfsHash || data.ipfsHash,
            pinataUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash || data.ipfsHash}`,
            gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash || data.ipfsHash}`,
          });
        } catch (err) {
          console.error('File upload error:', err);
          reject(err instanceof Error ? err : new Error('Failed to upload file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload JSON metadata to IPFS via Netlify Function
   */
  async uploadJSON(data: any, name?: string): Promise<IPFSUploadResult> {
    // Validate data
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON data provided');
    }

    try {
      JSON.stringify(data);
    } catch (error) {
      throw new Error('Data is not valid JSON');
    }

    const metadata = {
      name: name || `soulcred-metadata-${Date.now()}`,
      keyvalues: {
        type: 'metadata',
        uploadedAt: new Date().toISOString(),
        dataType: 'json',
        source: 'soulcred-dapp',
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
        throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        ipfsHash: result.IpfsHash || result.ipfsHash,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash || result.ipfsHash}`,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash || result.ipfsHash}`,
      };
    } catch (error: any) {
      console.error('JSON upload error:', error);
      throw new Error(error.message || 'Failed to upload JSON to IPFS');
    }
  }

  /**
   * Create NFT metadata following OpenSea standard
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
      external_url: 'https://soulcred-dapp.netlify.app',
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
        platform: 'SoulCred',
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
      `https://dweb.link/ipfs/${ipfsHash}`,
    ];

    let lastError: Error;

    for (const gateway of gateways) {
      try {
        const response = await axios.get(gateway, {
          responseType: 'blob',
          timeout: 15000,
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
    try {
      const testData = { 
        test: true, 
        timestamp: Date.now(),
        source: 'soulcred-connection-test'
      };
      await this.uploadJSON(testData, 'connection-test');
      console.log('✅ IPFS connection test successful');
      return true;
    } catch (error) {
      console.error('❌ IPFS connection test failed:', error);
      return false;
    }
  }
}

export const ipfsService = new IPFSService();