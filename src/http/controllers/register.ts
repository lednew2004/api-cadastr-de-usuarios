import { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { AlreadyCpfExistError } from "../../use-cases/error/already-cpf-exist-error";
import { makeRegisterUseCase } from "../../use-cases/factories/make-register-use-case";

export async function Register(request: FastifyRequest, reply: FastifyReply) {
  const bodyRegisterSchema = z.object({
    name: z.string(),
    cpf: z.string().min(11),
  });

  const { cpf, name } = bodyRegisterSchema.parse(request.body);
  console.log(request.body);

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({ cpf, name });
  } catch (err) {
    if (err instanceof AlreadyCpfExistError) {
      return reply.status(409).send({ message: err.message });
    }

    throw err;
  }

  return reply.status(201).send();
}
