import { services } from '../../config/dependencies.js';
import {
  UserArgs,
  UpdateUserArgs,
  CreateUserArgs,
  DeleteUserArgs,
} from './user.args.js';

export const UserResolver = {
  Query: {
    user: (_: undefined, args: UserArgs) => {
      return services.userService.getUser(args.where);
    },
    users: () => {
      return services.userService.getUsers();
    },
  },
  Mutation: {
    createUser: (_: undefined, args: CreateUserArgs) => {
      return services.userService.createUser(args);
    },
    updateUser: (_: undefined, args: UpdateUserArgs) => {
      return services.userService.updateUser(args);
    },
    deleteUser: (_: undefined, args: DeleteUserArgs) => {
      return services.userService.deleteUser(args.where);
    },
  },
};
