import { Prisma, Shopping, User } from "../../generated/prisma/client";

export interface ShoppingRepository {
  create(data: Prisma.ShoppingCreateInput): Promise<Shopping>;
  findByCpfExist(cpf: string): Promise<User | null>;
}
