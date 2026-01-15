import { randomUUID } from "node:crypto";
import { Prisma, Shopping, User } from "../../../generated/prisma/client";
import { ShoppingRepository } from "../shopping-repository";

export class InMemoryShoppingRepository implements ShoppingRepository {
  findByCpfExist(cpf: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  private database: Shopping[] = [];
  async create(data: Prisma.ShoppingCreateInput) {
    const newShopping: Shopping = {
      id: randomUUID(),
      value: data.value,
      itens: data.itens as Prisma.JsonValue,
      data: new Date(),
      userid: data.user.connect?.id as string,
    };

    this.database.push(newShopping);

    return newShopping;
  }
}
