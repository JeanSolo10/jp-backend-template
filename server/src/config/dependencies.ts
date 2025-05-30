import { PrismaClient } from '@prisma/client';
import { DbService } from '../database/db.service.js';
import { UserService } from '../restAPI/user/user.service.js';
import { UserController } from '../restAPI/user/user.controller.js';
import { UserService as UserServiceGraphql } from '../graphql/user/user.service.js';
import logger from '../logger/logger.js';

const prisma = new PrismaClient();
const dbService = new DbService(prisma, logger);
const userService = new UserService(dbService);
const userController = new UserController(userService);
const userServiceGraphql = new UserServiceGraphql(dbService);

const services = {
  userService,
  userServiceGraphql,
};

const controllers = {
  userController,
};

export { services, controllers, dbService };
