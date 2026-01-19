/**
 * Centralized logging utility that wraps console methods
 * Can be enabled/disabled globally via environment variables or runtime configuration
 */

interface LoggerConfig {
  enabled: boolean;
  level: 'debug' | 'info' | 'warn' | 'error';
}

class Logger {
  private config: LoggerConfig = {
    enabled: process.env.REACT_APP_LOGGING_ENABLED !== 'false',
    level: (process.env.REACT_APP_LOG_LEVEL as 'debug' | 'info' | 'warn' | 'error') || 'info'
  };

  private shouldLog(messageLevel: 'debug' | 'info' | 'warn' | 'error'): boolean {
    if (!this.config.enabled) return false;

    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[messageLevel] >= levels[this.config.level];
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, data);
    }
  }

  error(message: string, data?: any): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, data);
    }
  }

  setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  setLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.config.level = level;
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }
}

export const logger = new Logger();
