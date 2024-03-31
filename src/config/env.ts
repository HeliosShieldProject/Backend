import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  MASTER_BACKEND_PORT: z.string().trim(),
  DATABASE_PORT: z.string().trim(),
  DATABASE_NAME: z.string().trim(),
  DATABASE_USER: z.string().trim(),
  DATABASE_PASSWORD: z.string().trim(),
  JWT_SECRET: z.string().trim(),
  SALT: z.string().trim(),
});

export const env = envSchema.parse(process.env);
