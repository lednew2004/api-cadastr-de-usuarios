import z from "zod";
import { configDotenv } from "dotenv";
configDotenv();

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid Variable Environment ", _env.error.format);
  throw new Error("Invalid Variable Environment");
}

export const env = _env.data;
