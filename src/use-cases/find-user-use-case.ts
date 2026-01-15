import { User } from "../../generated/prisma/client";
import { UsersRepository } from "../repositories/users-repository";
import { InvalidCredentialsUserError } from "./error/invalid-credentials-user-error";

interface FindUserUseCaseResponse {
  user: User;
}

interface FindUserUseCaseRequest {
  cpf: string;
}

export class FindUserUseCase {
  constructor(private UsersRepository: UsersRepository) {}
  async execute({
    cpf,
  }: FindUserUseCaseRequest): Promise<FindUserUseCaseResponse> {
    const user = await this.UsersRepository.findUserCpf(cpf);

    if (!user) {
      throw new InvalidCredentialsUserError();
    }

    return {
      user,
    };
  }
}
