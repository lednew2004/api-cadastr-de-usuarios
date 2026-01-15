import { Prisma, User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { UsersRepository } from "../users-repository";

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }

  async findUserCpf(cpf: string) {
    const user = await prisma.user.findUnique({
      where: { cpf },
      include: { shopping: true },
    });
    return user;
  }

  async updateAccumulatedValue(userId: string, value: number){
    await prisma.user.update({
      where: {id: userId},
      data: {accumulatedValue: value},
    });
  };
}
