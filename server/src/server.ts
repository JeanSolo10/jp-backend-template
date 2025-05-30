import { dbService } from './config/dependencies.js';
import app from './app.js';
import logger from './logger/logger.js';

const PORT = process.env.SERVER_PORT ?? 3000;

const initializeServer = async () => {
  try {
    // connect to database
    await dbService.connect();

    // start server
    const server = app.listen(PORT, () => {
      logger.info(`[server] running on port ${PORT}`);
    });

    // handle shutdown
    const shutdown = async (signal: string) => {
      logger.info(`[server] ${signal} received, shutting down gracefully...`);
      server.close(async () => {
        logger.info('[server] HTTP server closed.');
        try {
          await dbService.disconnect();
          logger.info('[database] Disconnected successfully');
        } catch (dbError) {
          logger.error('[database] Error during disconnection', {
            error: dbError,
          });
        } finally {
          process.exit(0);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error: unknown) {
    logger.error('[server] Failed to initialize server', {
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : error,
    });
  }
};

process.on('uncaughtException', (error: Error) => {
  logger.error('UNCAUGHT EXCEPTION!', {
    error: { message: error.message, stack: error.stack },
  });
  console.error('UNCAUGHT EXCEPTION! Shutting down...', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('UNHANDLED REJECTION!', {
    reason: reason,
  });
  console.error('UNHANDLED REJECTION! Reason:', reason);
  process.exit(1);
});

initializeServer();
