import { PrismaShoppingRepository } from "../../repositories/prisma/prisma-shopping-repository";
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository";
import { RegisterShoppingUseCase } from "../registerShopping-use-case";

export function makeRegisterShoppingUseCase() {
  const prismaShoppingRepository = new PrismaShoppingRepository();
  const prismaUsersRepository = new PrismaUsersRepository();
  const registerShoppingUseCase = new RegisterShoppingUseCase(
    prismaShoppingRepository,
    prismaUsersRepository
  );

  return registerShoppingUseCase;
}
