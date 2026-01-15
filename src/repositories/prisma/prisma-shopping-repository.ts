import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ShoppingRepository } from "../shopping-repository";

export class PrismaShoppingRepository implements ShoppingRepository {
  async create(data: Prisma.ShoppingCreateInput) {
    const newShopping = await prisma.shopping.create({
      data,
    });

    return newShopping;
  }

  async findByCpfExist(cpf: string) {
    const user = await prisma.user.findUnique({ where: { cpf } });

    return user;
  }
}
