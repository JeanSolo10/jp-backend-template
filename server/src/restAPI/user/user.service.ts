import { DbService } from '../../database/db.service.js';
import { Prisma } from '@prisma/client';
import { User } from '@prisma/client';

export class UserService {
  constructor(private dbService: DbService) {}

  public async getUserById(id: number): Promise<User | null> {
    return this.dbService.useModel('user').findUnique({ where: { id } });
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.dbService.useModel('user').findUnique({ where: { email } });
  }

  public async getAllUsers(): Promise<User[]> {
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
