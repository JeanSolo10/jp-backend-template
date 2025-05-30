import { NextFunction, Request, Response } from 'express';
import { UserService } from '../user/user.service.js';
import { UserObject } from '../user/user.object.js';
import { CreateUserInput, UpdateUserInput } from './user.controller.args.js';
import { NotFoundError } from '../../errors/errors.js';

export class UserController {
  constructor(private userService: UserService) {}

  getUserById = async (
    req: Request<{ id: string }>,
    res: Response<UserObject | { error: string }>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    try {
      if (!id) {
        res.status(400).json({ error: 'An id must be provided' });
        return;
      }

      const user = await this.userService.getUserById(Number(id));

      if (!user) {
        throw NotFoundError('User not found');
      }

      res.status(200).json(user);
    } catch (error: unknown) {
      next(error);
    }
  };

  getUserByEmail = async (
    req: Request<{ email: string }>,
    res: Response<UserObject | { error: string }>,
    next: NextFunction,
  ): Promise<void> => {
    const { email } = req.params;

    try {
      if (!email) {
        res.status(400).json({ error: 'An email must be provided' });
        return;
      }

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw NotFoundError('User not found');
      }

      res.status(200).json(user);
    } catch (error: unknown) {
      next(error);
    }
  };

  getAllUSers = async (
    req: Request,
    res: Response<UserObject[] | { error: string }>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error: unknown) {
      next(error);
    }
  };

  updateUser = async (
    req: Request<{ id: string }, object, UpdateUserInput>,
    res: Response<UserObject | { error: string }>,
    next: NextFunction,
  ): Promise<void> => {
    const id = Number(req.params.id);

    try {
      if (!id || isNaN(id)) {
        res.status(400).json({ error: 'User id is required' });
        return;
      }

      const updatedUser = await this.userService.updateUser({
        where: { id },
        data: req.body,
      });

      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      next(error);
    }
  };

  createUser = async (
    req: Request<object, object, CreateUserInput>,
    res: Response<UserObject | { error: string }>,
    next: NextFunction,
  ): Promise<void> => {
    const data = { data: req.body };

    try {
      const user = await this.userService.createUser(data);
      res.status(201).json(user);
    } catch (error: unknown) {
      next(error);
    }
  };

  deleteUser = async (
    req: Request<{ id: string }>,
    res: Response<UserObject | { error: string }>,
    next: NextFunction,
  ): Promise<void> => {
    const { id } = req.params;

    try {
      if (!id) {
        res.status(400).json({ error: 'User id is required' });
        return;
      }

      const deletedUser = await this.userService.deleteUser({ id: Number(id) });
      res.status(200).json(deletedUser);
    } catch (error: unknown) {
      next(error);
    }
  };
}
