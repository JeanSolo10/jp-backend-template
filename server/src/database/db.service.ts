import { PrismaClient } from '@prisma/client';
import { Logger } from 'winston';

export class DbService {
  constructor(
    private prisma: PrismaClient,
    private logger: Logger,
  ) {}

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      this.logger.info('[database] Connected successfully');
    } catch (error: unknown) {
      this.logger.error(
        'Database connection failed',
        error instanceof Error ? error?.message : '',
      );
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    this.logger.info('Database disconnected successfully');
  }

  // Dynamic model access (e.g., dbService.user, dbService.post)
  public useModel<K extends keyof PrismaClient>(model: K): PrismaClient[K] {
    return this.prisma[model];
  }

  public async pingDb(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error: unknown) {
      let message = 'Unknown Error';
      if (error instanceof Error) {
        message = error.message;
      }
      this.logger.error('[database] Ping failed', {
        error: { message },
      });
      return false;
    }
  }
}
