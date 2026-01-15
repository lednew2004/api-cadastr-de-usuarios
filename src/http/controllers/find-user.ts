import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { InvalidCredentialsUserError } from "../../use-cases/error/invalid-credentials-user-error";
import { makeFindUserUseCase } from "../../use-cases/factories/make-find-user-use-case";

export async function findUserToCpf(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const paramsSchema = z.object({
    cpf: z.string(),
  });

  const { cpf } = paramsSchema.parse(request.params);

  try {
    const findUserUseCase = makeFindUserUseCase();
    const user = await findUserUseCase.execute({ cpf });

    return reply.status(200).send(user);
  } catch (err) {
    if (err instanceof InvalidCredentialsUserError) {
      return reply.status(404).send({ message: err.message });
    }
  }
}
