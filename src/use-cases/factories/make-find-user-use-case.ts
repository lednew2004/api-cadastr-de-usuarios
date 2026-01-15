import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { FindUserUseCase } from "../find-user-use-case";

export function makeFindUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository();
  const findUsersUseCase = new FindUserUseCase(prismaUsersRepository);

  return findUsersUseCase;
}
