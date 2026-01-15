import { Prisma, User } from "../../generated/prisma/client";

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findUserCpf(cpf: string): Promise<User | null>;
  updateAccumulatedValue(userId: string, value: number): Promise<void>;
}
