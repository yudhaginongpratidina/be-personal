import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';


// Secure log directory configuration
const LOG_DIR = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
const MAX_LOG_SIZE = process.env.MAX_LOG_SIZE || '20m';
const MAX_FILES = process.env.MAX_FILES || '14d';
const DATE_PATTERN = 'YYYY-MM-DD';


// Ensure log directory exists with proper permissions
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, {
        recursive: true,
        mode: 0o750 // rwxr-x--- (owner: rwx, group: r-x, other: none)
    });
}


// Security: Sanitize sensitive data from logs
const sensitiveFields = [
    'password', 'token', 'authorization', 'cookie', 'session',
    'secret', 'key', 'auth', 'credentials', 'x-api-key',
    'client_secret', 'access_token', 'refresh_token', 'jwt',
    'ssn', 'social_security', 'credit_card', 'card_number',
    'cvv', 'pin', 'otp', 'private_key', 'signature'
];


// Data sanitization function
function sanitizeLogData(obj, depth = 0) {
    if (depth > 10) return '[Max Depth Exceeded]'; // Prevent infinite recursion

    if (obj === null || obj === undefined) return obj;

    if (typeof obj === 'string') {
        // Check for potential sensitive patterns
        const sensitivePatterns = [
            /Bearer\s+[A-Za-z0-9\-._~+/]+=*/i,
            /\b[A-Za-z0-9]{20,}\b/, // Potential tokens
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
            /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
        ];

        for (const pattern of sensitivePatterns) {
            if (pattern.test(obj)) {
                return '[REDACTED]';
            }
        }

        // Truncate very long strings to prevent log injection
        if (obj.length > 1000) {
            return obj.substring(0, 1000) + '...[TRUNCATED]';
        }

        return obj;
    }

    if (typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeLogData(item, depth + 1));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();

        // Check if key contains sensitive field names
        const isSensitive = sensitiveFields.some(field =>
            lowerKey.includes(field) || key.includes(field)
        );

        if (isSensitive) {
            sanitized[key] = '[REDACTED]';
        } else {
            sanitized[key] = sanitizeLogData(value, depth + 1);
        }
    }

    return sanitized;
}


// Custom format with security enhancements
const secureFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        // Generate request ID for correlation
        const requestId = meta.requestId || crypto.randomUUID().substring(0, 8);

        // Sanitize all data
        const sanitizedMeta = sanitizeLogData(meta);
        const sanitizedMessage = typeof message === 'string'
            ? sanitizeLogData(message)
            : sanitizeLogData(message);

        // Base log entry
        const logEntry = {
            timestamp,
            level: level.toUpperCase(),
            requestId,
            message: sanitizedMessage,
            pid: process.pid,
            ...(Object.keys(sanitizedMeta).length > 0 && { meta: sanitizedMeta }),
            ...(stack && { stack })
        };

        return JSON.stringify(logEntry);
    })
);


// Transport configurations with security settings
const createTransports = () => {
    const transports = [];

    // Console transport for development
    if (process.env.NODE_ENV !== 'production') {
        transports.push(
            new winston.transports.Console({
                level: 'debug',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            })
        );
    }

    // Error log transport
    transports.push(
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'error-%DATE%.log'),
            datePattern: DATE_PATTERN,
            level: 'error',
            maxSize: MAX_LOG_SIZE,
            maxFiles: MAX_FILES,
            zippedArchive: true,
            auditFile: path.join(LOG_DIR, 'error-audit.json'),
            format: secureFormat,
            options: {
                flags: 'a',
                mode: 0o640 // rw-r----- (owner: rw, group: r, other: none)
            }
        })
    );

    // Combined log transport
    transports.push(
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'combined-%DATE%.log'),
            datePattern: DATE_PATTERN,
            level: 'info',
            maxSize: MAX_LOG_SIZE,
            maxFiles: MAX_FILES,
            zippedArchive: true,
            auditFile: path.join(LOG_DIR, 'combined-audit.json'),
            format: secureFormat,
            options: {
                flags: 'a',
                mode: 0o640
            }
        })
    );

    // Debug log transport (only in development/staging)
    if (process.env.NODE_ENV !== 'production') {
        transports.push(
            new DailyRotateFile({
                filename: path.join(LOG_DIR, 'debug-%DATE%.log'),
                datePattern: DATE_PATTERN,
                level: 'debug',
                maxSize: MAX_LOG_SIZE,
                maxFiles: '7d', // Shorter retention for debug logs
                zippedArchive: true,
                auditFile: path.join(LOG_DIR, 'debug-audit.json'),
                format: secureFormat,
                options: {
                    flags: 'a',
                    mode: 0o640
                }
            })
        );
    }

    // Security audit log transport
    transports.push(
        new DailyRotateFile({
            filename: path.join(LOG_DIR, 'security-%DATE%.log'),
            datePattern: DATE_PATTERN,
            level: 'warn',
            maxSize: MAX_LOG_SIZE,
            maxFiles: '90d', // Longer retention for security logs
            zippedArchive: true,
            auditFile: path.join(LOG_DIR, 'security-audit.json'),
            format: secureFormat,
            options: {
                flags: 'a',
                mode: 0o640
            }
        })
    );

    return transports;
};


// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    transports: createTransports(),
    exitOnError: false,
    // Prevent uncaught exceptions from crashing the app
    handleExceptions: true,
    handleRejections: true
});


// Security event logging methods
logger.security = (message, meta = {}) => {
    logger.warn(message, {
        ...meta,
        category: 'SECURITY',
        timestamp: new Date().toISOString()
    });
};


logger.audit = (action, user, resource, meta = {}) => {
    logger.info('AUDIT_EVENT', {
        action,
        user: sanitizeLogData(user),
        resource,
        ...meta,
        category: 'AUDIT',
        timestamp: new Date().toISOString()
    });
};


// Rate limiting for log entries to prevent DoS
const logRateLimit = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 1000; // Max logs per minute


const originalLog = logger.log;
logger.log = function (level, message, meta = {}) {
    const now = Date.now();
    const key = `${level}:${typeof message === 'string' ? message.substring(0, 50) : 'object'}`;

    if (!logRateLimit.has(key)) {
        logRateLimit.set(key, { count: 0, windowStart: now });
    }

    const rateLimitData = logRateLimit.get(key);

    // Reset window if expired
    if (now - rateLimitData.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitData.count = 0;
        rateLimitData.windowStart = now;
    }

    // Check rate limit
    if (rateLimitData.count >= RATE_LIMIT_MAX) {
        return; // Drop log entry
    }

    rateLimitData.count++;

    // Add security context
    const enhancedMeta = {
        ...meta,
        userAgent: meta.userAgent ? sanitizeLogData(meta.userAgent) : undefined,
        ip: meta.ip ? sanitizeLogData(meta.ip) : undefined,
        sessionId: meta.sessionId ? sanitizeLogData(meta.sessionId) : undefined
    };

    return originalLog.call(this, level, message, enhancedMeta);
};


// Cleanup old rate limit entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of logRateLimit.entries()) {
        if (now - data.windowStart > RATE_LIMIT_WINDOW * 2) {
            logRateLimit.delete(key);
        }
    }
}, RATE_LIMIT_WINDOW);


// Error handling for transport failures
logger.on('error', (error) => {
    console.error('Logger error:', error);
});


// Graceful shutdown
process.on('SIGINT', () => {
    logger.info('Shutting down logger...');
    logger.end();
});


export default logger;