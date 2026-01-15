import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { UserInexistError } from "../../use-cases/error/user-inexists-error";
import { makeRegisterShoppingUseCase } from "../../use-cases/factories/make-register-Shopping-use-case";

export async function registerShopping(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodySchema = z.object({
    cpf: z.string(),
    itens: z.array(z.string()),
    value: z.number(),
  });

  const { cpf, itens, value } = registerBodySchema.parse(request.body);

  try {
    const registerShoppingUseCase = makeRegisterShoppingUseCase();

    const result = await registerShoppingUseCase.create({
      cpf,
      itens,
      value,
    });

    return reply.status(201).send({
      shopping: result.newShopping,
      discountApplied: result.discountApplied,
    });
  } catch (err) {
    if (err instanceof UserInexistError) {
      return reply.status(404).send({ message: err.message });
    }

    throw err;
  }
}
