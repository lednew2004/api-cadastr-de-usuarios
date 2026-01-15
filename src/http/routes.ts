import { FastifyInstance } from "fastify";
import { Register } from "./controllers/register";
import { registerShopping } from "./controllers/register-shopping-use-case";
import { findUserToCpf } from "./controllers/find-user";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", Register);
  app.post("/shopping", registerShopping);
  app.get("/users/:cpf", findUserToCpf);
}
