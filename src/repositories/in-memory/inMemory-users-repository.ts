import { randomUUID } from "node:crypto";
import { Prisma, User } from "../../../generated/prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  private database: User[] = [];
  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      cpf: data.cpf,
      name: data.name,
      id: randomUUID(),
    };

    this.database.push(user);
    return user;
  }
  async findUserCpf(cpf: string) {
    const user = this.database.find((user) => user.cpf === cpf);
    return user ?? null;
  }
}
