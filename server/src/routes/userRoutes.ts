import express, { Router } from 'express';
import { controllers } from '../config/dependencies.js';
import { validateRequest } from '../middlewares/zodValidator.js';
import {
  CreateUserInput,
  UpdateUserInput,
  UserIdParam,
  UserEmailParam,
} from '../restAPI/user/user.controller.args.js';

export default function userRoutes(): Router {
  const router = express.Router();

  router.get(
    '/id/:id',
    validateRequest({
      params: UserIdParam,
    }),
    controllers.userController.getUserById,
  );

  router.get(
    '/email/:email?',
    validateRequest({
      params: UserEmailParam,
    }),
    controllers.userController.getUserByEmail,
  );

  router.get('/', controllers.userController.getAllUSers);

  router.post(
    '/createUser',
    validateRequest({
      body: CreateUserInput,
    }),
    controllers.userController.createUser,
  );

  router.patch(
    '/updateUser/:id',
    validateRequest({
      params: UserIdParam,
      body: UpdateUserInput,
    }),
    controllers.userController.updateUser,
  );

  router.delete(
    '/deleteUser/:id',
    validateRequest({
      params: UserIdParam,
    }),
    controllers.userController.deleteUser,
  );

  router.get('/welcome', (req, res) => {
    res.status(200).json({ msg: `Hello ${process.env.HELLO}!!` });
  });

  return router;
}
