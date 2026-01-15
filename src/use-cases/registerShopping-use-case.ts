import { ShoppingRepository } from "../repositories/shopping-repository";
import { UsersRepository } from "../repositories/users-repository";
import { UserInexistError } from "./error/user-inexists-error";

interface RegisterShoppingUseCaseRequest {
  itens: string[];
  value: number;
  cpf: string;
}

export class RegisterShoppingUseCase {
  constructor(
    private ShopingRepository: ShoppingRepository,
    private UserRepository: UsersRepository
  ) {}
  async create({ itens, value, cpf }: RegisterShoppingUseCaseRequest) {
    const user = await this.UserRepository.findUserCpf(cpf);

    if (!user) {
      throw new UserInexistError();
    }

    let discount = 0;
    let finalValue = value;

    const newAccumulated = user.accumulatedValue + value;

    if (newAccumulated >= 500) {
      discount = value * 0.2;
      finalValue = value - discount;
    }

    const newShopping = await this.ShopingRepository.create({
      value: finalValue,
      itens,
      discountApplied: discount,
      user: { connect: { id: user.id } },
    });

    await this.UserRepository.updateAccumulatedValue(
      user.id,
      newAccumulated >= 500 ? 0 : newAccumulated
    );

    return {
      newShopping,
      discountApplied: discount,
    };
  }
}
