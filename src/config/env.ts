import "dotenv/config";
import z from "zod";

export const NODE_ENV = z.enum(["development", "production", "test"]);
export type NODE_ENV = z.infer<typeof NODE_ENV>;

const envSchema = z.object({
  MASTER_BACKEND_PORT: z.string().trim(),
  DATABASE_PORT: z.string().trim(),
  DATABASE_NAME: z.string().trim(),
  DATABASE_USER: z.string().trim(),
  DATABASE_PASSWORD: z.string().trim(),
  JWT_ACCESS_SECRET: z.string().trim(),
  JWT_REFRESH_SECRET: z.string().trim(),
  SALT: z
    .string()
    .trim()
    .transform((value) => parseInt(value, 10)),
  LOGS_DATABASE_HOST: z.string().trim(),
  LOGS_DATABASE_PORT: z.string().trim(),
  LOGS_DATABASE_USER: z.string().trim(),
  LOGS_DATABASE_PASSWORD: z.string().trim(),
  NODE_ENV: NODE_ENV,
  LOGTAIL_SOURCE: z.string().trim(),
});
export const env = envSchema.parse(process.env);
