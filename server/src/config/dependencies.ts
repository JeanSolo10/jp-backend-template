import { PrismaClient } from '@prisma/client';
import { DbService } from '../database/db.service.js';
import { UserService } from '../graphql/user/user.service.js';
import logger from '../logger/logger.js';

const prisma = new PrismaClient();
const dbService = new DbService(prisma, logger);
const userService = new UserService(dbService);

const services = {
  userService,
};

export { services, dbService };
