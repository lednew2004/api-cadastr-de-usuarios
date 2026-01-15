import { User } from "../../generated/prisma/client";
import { UsersRepository } from "../repositories/users-repository";
import { AlreadyCpfExistError } from "./error/already-cpf-exist-error";

interface RegisterUseCaseRequest {
  name: string;
  cpf: string;
}

interface RegisterUseCaseResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    cpf,
    name,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const existUserFindCpf = await this.UsersRepository.findUserCpf(cpf);

    if (existUserFindCpf) {
      throw new AlreadyCpfExistError();
    }

    const user = await this.UsersRepository.create({
      cpf,
      name,
    });

    return {
      user,
    };
  }
}
