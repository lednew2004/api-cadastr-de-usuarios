import { it, describe, test, expect } from "vitest";
import { RegisterUseCase } from "./register-use-case";
import { AlreadyCpfExistError } from "./error/already-cpf-exist-error";
import { InMemoryUsersRepository } from "../repositories/in-memory/inMemory-users-repository";

describe("register users", () => {
  const inMemoryUsersRepository = new InMemoryUsersRepository();
  const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);
  it("Deve ser possivel realizar o cadastro de um usuário", async () => {
    try {
      const { cpf, name } = {
        name: "mary doe",
        cpf: "00131862345",
      };

      const user = await registerUseCase.execute({ cpf, name });

      expect(user).exist;
      console.log(user);
    } catch (err) {
      console.error(err);
    }
  });

  it("Não deve ser possivel criar o mesmo usuario duas vezes", async () => {
    try {
      const { cpf, name } = {
        name: "john doe",
        cpf: "20089067867",
      };

      const userOne = await registerUseCase.execute({ cpf, name });
      console.log(userOne);
      const userTwo = await registerUseCase.execute({ cpf, name });

      expect(userTwo).instanceOf(AlreadyCpfExistError);
      console.log(userTwo);
    } catch (err) {
      console.error(err);
    }
  });
});
