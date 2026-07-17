// Winston is a versatile logging library for Node.js, designed to be simple and universal, allowing you to log with various transports.

// 1 View logs in the console.
// 2 Save logs to files (e.g., error.log and combined.log).
// 3 Store error and info logs in separate files.
// 4 Add timestamps to log entries.
// 5 Customize the log format (JSON or human-readable text).
// 6 Maintain and manage logs efficiently in production environments.

// https://www.npmjs.com/package/winston

import winston from 'winston';
import { Config } from './index';

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        serviceName: 'auth-service',
    },
    transports: [
        new winston.transports.File({
            dirname: 'logs',
            filename: 'combined.log',
            level: 'info',
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            silent: Config.NODE_ENV === 'test',
        }),
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: false,
        }),
    ],
});

export default logger;
