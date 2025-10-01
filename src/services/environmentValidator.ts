export interface EnvironmentConfig {
  alchemyApiKey?: string;
  infuraApiKey?: string;
  walletConnectProjectId?: string;
  pinataJwt?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config: EnvironmentConfig;
  features: {
    blockchain: boolean;
    walletConnect: boolean;
    ipfsUpload: boolean;
    database: boolean;
  };
}

export class EnvironmentValidator {
  private static instance: EnvironmentValidator;

  private constructor() {}

  static getInstance(): EnvironmentValidator {
    if (!EnvironmentValidator.instance) {
      EnvironmentValidator.instance = new EnvironmentValidator();
    }
    return EnvironmentValidator.instance;
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const config: EnvironmentConfig = {
      alchemyApiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
      infuraApiKey: import.meta.env.VITE_INFURA_API_KEY,
      walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
      pinataJwt: import.meta.env.VITE_PINATA_JWT,
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    };

    const hasAlchemy = this.isValidApiKey(config.alchemyApiKey);
    const hasInfura = this.isValidApiKey(config.infuraApiKey);
    const hasWalletConnect = this.isValidApiKey(config.walletConnectProjectId);
    const hasPinata = this.isValidApiKey(config.pinataJwt);
    const hasSupabase = this.isValidApiKey(config.supabaseUrl) && this.isValidApiKey(config.supabaseAnonKey);

    if (!hasAlchemy && !hasInfura) {
      warnings.push(
        'No RPC provider configured (Alchemy/Infura). Using public RPC which may have rate limits.'
      );
    }

    if (!hasWalletConnect) {
      warnings.push(
        'WalletConnect not configured. Mobile wallet support will be limited.'
      );
    }

    if (!hasPinata) {
      errors.push(
        'CRITICAL: Pinata JWT not configured. File uploads to IPFS will fail.'
      );
    }

    if (!hasSupabase) {
      warnings.push(
        'Supabase not configured. Using localStorage for data persistence (data will be lost on browser clear).'
      );
    }

    const features = {
      blockchain: hasAlchemy || hasInfura,
      walletConnect: hasWalletConnect,
      ipfsUpload: hasPinata,
      database: hasSupabase,
    };

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      config,
      features,
    };
  }

  private isValidApiKey(key: string | undefined): boolean {
    if (!key) return false;
    if (key.includes('your_') || key.includes('_here')) return false;
    if (key === 'placeholder') return false;
    if (key.length < 10) return false;
    return true;
  }

  validateOnStartup(): void {
    const result = this.validate();

    console.log('========================================');
    console.log('SoulCred Environment Validation');
    console.log('========================================');

    if (result.isValid) {
      console.log('Status: READY');
    } else {
      console.warn('Status: DEGRADED MODE');
    }

    console.log('');
    console.log('Features:');
    console.log(`  Blockchain RPC: ${result.features.blockchain ? 'Configured' : 'Using public RPC'}`);
    console.log(`  WalletConnect: ${result.features.walletConnect ? 'Enabled' : 'Disabled'}`);
    console.log(`  IPFS Uploads: ${result.features.ipfsUpload ? 'Enabled' : 'DISABLED'}`);
    console.log(`  Database: ${result.features.database ? 'Supabase' : 'localStorage fallback'}`);

    if (result.warnings.length > 0) {
      console.log('');
      console.warn('Warnings:');
      result.warnings.forEach((warning, index) => {
        console.warn(`  ${index + 1}. ${warning}`);
      });
    }

    if (result.errors.length > 0) {
      console.log('');
      console.error('ERRORS:');
      result.errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error}`);
      });
    }

    if (!result.isValid || result.warnings.length > 0) {
      console.log('');
      console.log('To fix these issues:');
      console.log('  1. Copy .env.example to .env');
      console.log('  2. Add your API keys to .env');
      console.log('  3. Restart the development server');
      console.log('');
      console.log('Get API keys from:');
      console.log('  Alchemy: https://alchemy.com');
      console.log('  Infura: https://infura.io');
      console.log('  WalletConnect: https://cloud.walletconnect.com');
      console.log('  Pinata: https://pinata.cloud');
    }

    console.log('========================================');
  }

  getFeatureAvailability() {
    const result = this.validate();
    return result.features;
  }

  isFeatureEnabled(feature: keyof ValidationResult['features']): boolean {
    const result = this.validate();
    return result.features[feature];
  }

  getMissingConfig(): string[] {
    const result = this.validate();
    const missing: string[] = [];

    if (!result.features.blockchain) {
      missing.push('VITE_ALCHEMY_API_KEY or VITE_INFURA_API_KEY');
    }
    if (!result.features.walletConnect) {
      missing.push('VITE_WALLETCONNECT_PROJECT_ID');
    }
    if (!result.features.ipfsUpload) {
      missing.push('VITE_PINATA_JWT');
    }
    if (!result.features.database) {
      missing.push('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    }

    return missing;
  }
}

export const environmentValidator = EnvironmentValidator.getInstance();
