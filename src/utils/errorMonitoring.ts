export interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'blockchain' | 'ipfs' | 'ui' | 'network' | 'unknown';
  metadata?: Record<string, any>;
}

export class ErrorMonitor {
  private static instance: ErrorMonitor;
  private errors: ErrorReport[] = [];
  private maxStoredErrors = 50;

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor();
    }
    return ErrorMonitor.instance;
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        severity: 'high',
        category: 'unknown',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        severity: 'high',
        category: 'unknown',
        metadata: {
          reason: event.reason,
        },
      });
    });
  }

  captureError(error: Partial<ErrorReport>): void {
    const errorReport: ErrorReport = {
      message: error.message || 'Unknown error',
      stack: error.stack,
      componentStack: error.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: error.severity || 'medium',
      category: error.category || 'unknown',
      metadata: error.metadata,
    };

    this.errors.push(errorReport);

    if (this.errors.length > this.maxStoredErrors) {
      this.errors.shift();
    }

    this.saveToLocalStorage();

    console.error(`[ErrorMonitor] ${errorReport.severity.toUpperCase()}:`, errorReport);

    if (errorReport.severity === 'critical') {
      this.notifyCriticalError(errorReport);
    }
  }

  captureBlockchainError(error: any, context?: string): void {
    let message = 'Blockchain transaction failed';
    let severity: ErrorReport['severity'] = 'high';

    if (error?.message) {
      message = error.message;
    }

    if (error?.code) {
      switch (error.code) {
        case 'ACTION_REJECTED':
        case 4001:
          message = 'Transaction rejected by user';
          severity = 'low';
          break;
        case 'INSUFFICIENT_FUNDS':
          message = 'Insufficient funds for transaction';
          severity = 'medium';
          break;
        case 'NETWORK_ERROR':
          message = 'Network connection error';
          severity = 'high';
          break;
        case 'UNPREDICTABLE_GAS_LIMIT':
          message = 'Unable to estimate gas limit';
          severity = 'medium';
          break;
        default:
          message = error.message || 'Unknown blockchain error';
      }
    }

    this.captureError({
      message: `${context ? `${context}: ` : ''}${message}`,
      stack: error?.stack,
      severity,
      category: 'blockchain',
      metadata: {
        code: error?.code,
        data: error?.data,
        transaction: error?.transaction,
      },
    });
  }

  captureIPFSError(error: any, operation: string): void {
    this.captureError({
      message: `IPFS ${operation} failed: ${error?.message || 'Unknown error'}`,
      stack: error?.stack,
      severity: 'high',
      category: 'ipfs',
      metadata: {
        operation,
        error: error,
      },
    });
  }

  captureNetworkError(error: any, url?: string): void {
    this.captureError({
      message: `Network request failed: ${error?.message || 'Unknown error'}`,
      stack: error?.stack,
      severity: 'medium',
      category: 'network',
      metadata: {
        url,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
      },
    });
  }

  captureUIError(error: any, componentName?: string): void {
    this.captureError({
      message: `UI Error${componentName ? ` in ${componentName}` : ''}: ${error?.message || 'Unknown error'}`,
      stack: error?.stack,
      componentStack: error?.componentStack,
      severity: 'medium',
      category: 'ui',
      metadata: {
        component: componentName,
      },
    });
  }

  getErrors(category?: ErrorReport['category']): ErrorReport[] {
    if (category) {
      return this.errors.filter((error) => error.category === category);
    }
    return [...this.errors];
  }

  getCriticalErrors(): ErrorReport[] {
    return this.errors.filter((error) => error.severity === 'critical');
  }

  getRecentErrors(count: number = 10): ErrorReport[] {
    return this.errors.slice(-count);
  }

  clearErrors(): void {
    this.errors = [];
    this.saveToLocalStorage();
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('soulcred-error-log', JSON.stringify(this.errors));
    } catch (error) {
      console.warn('Failed to save error log to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem('soulcred-error-log');
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load error log from localStorage:', error);
    }
  }

  private notifyCriticalError(error: ErrorReport): void {
    if (window.dispatchEvent) {
      window.dispatchEvent(
        new CustomEvent('soulcred:critical-error', {
          detail: error,
        })
      );
    }
  }

  getErrorStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
  } {
    const stats = {
      total: this.errors.length,
      bySeverity: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
    };

    this.errors.forEach((error) => {
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
    });

    return stats;
  }

  exportErrors(): string {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errors: this.errors,
        stats: this.getErrorStats(),
      },
      null,
      2
    );
  }
}

export const errorMonitor = ErrorMonitor.getInstance();

export function withErrorMonitoring<T extends (...args: any[]) => any>(
  fn: T,
  context?: string
): T {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);

      if (result instanceof Promise) {
        return result.catch((error) => {
          errorMonitor.captureError({
            message: `Async error in ${context || fn.name}: ${error?.message || 'Unknown error'}`,
            stack: error?.stack,
            severity: 'high',
            category: 'unknown',
            metadata: { context, args },
          });
          throw error;
        });
      }

      return result;
    } catch (error: any) {
      errorMonitor.captureError({
        message: `Error in ${context || fn.name}: ${error?.message || 'Unknown error'}`,
        stack: error?.stack,
        severity: 'high',
        category: 'unknown',
        metadata: { context, args },
      });
      throw error;
    }
  }) as T;
}
