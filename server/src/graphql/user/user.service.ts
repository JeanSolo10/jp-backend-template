import { DbService } from '../../database/db.service.js';
import { Prisma, User } from '@prisma/client';

export class UserService {
  constructor(private dbService: DbService) {}

  public async getUser(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.dbService.useModel('user').findUnique({ where });
  }

  public async getUsers(): Promise<User[]> {
    return this.dbService.useModel('user').findMany();
  }

  public async createUser(args: Prisma.UserCreateArgs): Promise<User> {
    return this.dbService.useModel('user').create({
      data: args.data,
    });
  }

  public async updateUser(args: Prisma.UserUpdateArgs): Promise<User> {
    return this.dbService.useModel('user').update(args);
  }

  public async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.dbService.useModel('user').delete({ where });
  }
}
