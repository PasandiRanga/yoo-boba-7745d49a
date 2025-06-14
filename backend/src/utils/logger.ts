import { Request } from 'express';

interface SecurityEvent {
  type: 'FAILED_LOGIN' | 'INVALID_TOKEN' | 'RATE_LIMIT_EXCEEDED' | 'SUSPICIOUS_ACTIVITY';
  ip: string;
  userAgent?: string;
  email?: string;
  timestamp: Date;
  details?: any;
}

export class SecurityLogger {
  static logSecurityEvent(event: SecurityEvent) {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
    };
    
    // In production, this should be sent to a proper logging service
    console.error('[SECURITY_EVENT]', JSON.stringify(logEntry));
    
    // TODO: In production, implement:
    // - Send to logging service (e.g., CloudWatch, LogDNA)
    // - Store in database for analysis
    // - Send alerts for critical events
  }

  static logFailedLogin(req: Request, email?: string) {
    this.logSecurityEvent({
      type: 'FAILED_LOGIN',
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      email,
      timestamp: new Date(),
    });
  }

  static logInvalidToken(req: Request) {
    this.logSecurityEvent({
      type: 'INVALID_TOKEN',
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
    });
  }

  static logRateLimitExceeded(req: Request) {
    this.logSecurityEvent({
      type: 'RATE_LIMIT_EXCEEDED',
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent'),
      timestamp: new Date(),
    });
  }
}