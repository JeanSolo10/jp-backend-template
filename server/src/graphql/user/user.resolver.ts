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
      return services.userServiceGraphql.getUser(args.where);
    },
    users: () => {
      return services.userServiceGraphql.getUsers();
    },
  },
  Mutation: {
    createUser: (_: undefined, args: CreateUserArgs) => {
      return services.userServiceGraphql.createUser(args);
    },
    updateUser: (_: undefined, args: UpdateUserArgs) => {
      return services.userServiceGraphql.updateUser(args);
    },
    deleteUser: (_: undefined, args: DeleteUserArgs) => {
      return services.userServiceGraphql.deleteUser(args.where);
    },
  },
};
