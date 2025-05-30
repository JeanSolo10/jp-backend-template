export type UserWhereUniqueInput = {
  id: number;
  email: string;
};

export type UserArgs = {
  where: UserWhereUniqueInput;
};

type UserUpdateInput = {
  email: string;
  name?: string | null;
};

export type CreateUserArgs = {
  data: { email: string; name?: string | null };
};

export type UpdateUserArgs = {
  where: UserWhereUniqueInput;
  data: UserUpdateInput;
};

export type DeleteUserArgs = {
  where: UserWhereUniqueInput;
};
