/**
 * Validation utilities for SoulCred application
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email address
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL
 */
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate Ethereum address
 */
export const validateEthereumAddress = (address: string): boolean => {
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
};

/**
 * Validate credential form data
 */
export const validateCredentialForm = (formData: any): ValidationResult => {
  const errors: string[] = [];

  // Title validation
  if (!formData.title || formData.title.trim().length === 0) {
    errors.push('Title is required');
  } else if (formData.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }

  // Category validation
  if (!formData.category) {
    errors.push('Category is required');
  }

  // Description validation
  if (!formData.description || formData.description.trim().length === 0) {
    errors.push('Description is required');
  } else if (formData.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }

  // Skills validation
  if (!formData.skills || formData.skills.length === 0) {
    errors.push('At least one skill is required');
  } else if (formData.skills.length > 20) {
    errors.push('Maximum 20 skills allowed');
  }

  // Evidence validation
  const totalEvidence = (formData.evidence?.length || 0) + (formData.evidenceFiles?.length || 0);
  if (totalEvidence === 0) {
    errors.push('At least one piece of evidence is required');
  }

  // Validate evidence URLs
  if (formData.evidence) {
    formData.evidence.forEach((url: string, index: number) => {
      if (!validateUrl(url)) {
        errors.push(`Evidence link ${index + 1} is not a valid URL`);
      }
    });
  }

  // Impact metrics validation
  if (formData.impactMetrics) {
    const metrics = formData.impactMetrics;
    if (metrics.learningHours < 0 || metrics.learningHours > 10000) {
      errors.push('Learning hours must be between 0 and 10,000');
    }
    if (metrics.projectsCompleted < 0 || metrics.projectsCompleted > 1000) {
      errors.push('Projects completed must be between 0 and 1,000');
    }
    if (metrics.peersHelped < 0 || metrics.peersHelped > 10000) {
      errors.push('Peers helped must be between 0 and 10,000');
    }
    if (metrics.communityContributions < 0 || metrics.communityContributions > 1000) {
      errors.push('Community contributions must be between 0 and 1,000');
    }
  }

  // Issuer validation
  if (formData.issuer && formData.issuer.length > 100) {
    errors.push('Issuer name must be 100 characters or less');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate file upload
 */
export const validateFileUpload = (file: File, maxSize: number = 10 * 1024 * 1024): ValidationResult => {
  const errors: string[] = [];

  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }

  // Size validation
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }

  // Type validation (allow common file types)
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown'
  ];

  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not supported. Please upload images, PDFs, or documents.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Validate search query
 */
export const validateSearchQuery = (query: string): boolean => {
  return query.length >= 2 && query.length <= 100;
};

/**
 * Check if string contains only safe characters
 */
export const isSafeString = (str: string): boolean => {
  const safePattern = /^[a-zA-Z0-9\s\-_.,!?()]+$/;
  return safePattern.test(str);
};

/**
 * Validate skill name
 */
export const validateSkill = (skill: string): ValidationResult => {
  const errors: string[] = [];

  if (!skill || skill.trim().length === 0) {
    errors.push('Skill name is required');
  } else if (skill.length > 50) {
    errors.push('Skill name must be 50 characters or less');
  } else if (!isSafeString(skill)) {
    errors.push('Skill name contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate user profile data
 */
export const validateUserProfile = (profileData: any): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!profileData.name || profileData.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (profileData.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  // Bio validation
  if (profileData.bio && profileData.bio.length > 500) {
    errors.push('Bio must be 500 characters or less');
  }

  // Location validation
  if (profileData.location && profileData.location.length > 100) {
    errors.push('Location must be 100 characters or less');
  }

  // Skills validation
  if (profileData.skills && profileData.skills.length > 50) {
    errors.push('Maximum 50 skills allowed');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();