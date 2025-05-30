import { createLogger, format, transports } from 'winston';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

const formatConsole = format.combine(
  // workaround to transform level to uppercase
  // as it does not work when doing it inline info.level.toUpperCase()
  format((info) => {
    info.level = info.level.toUpperCase();
    return info;
  })(),
  format.colorize({ level: true }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(
    ({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`,
  ),
);

const formatFile = format.combine(format.timestamp(), format.json());

const logger = createLogger({
  level: LOG_LEVEL,
  format: formatFile,
  transports: [
    // write all logs with importance level of `error` or higher to `error.log`
    new transports.File({
      filename: path.join(__dirname, '../../logs/error.log'),
      level: 'error',
    }),
    // write all logs with importance level of `info` or higher to `combined.log
    new transports.File({
      filename: path.join(__dirname, '../../logs/combined.log'),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: formatConsole,
    }),
  );
}

export default logger;
