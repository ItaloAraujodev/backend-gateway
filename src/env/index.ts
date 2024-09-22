import "dotenv/config";
import { z } from "zod";

// Validando as variaveis de abiente

const envSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  WEBHOOK_URL: z.string(),
  PORT: z.string().default("3000"),
  MERCADO_PAGO_ACCESS_TOKEN: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}
export const env = _env.data;
