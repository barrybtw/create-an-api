import { z } from "zod";

const _ = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("3000"),
  DATABASE_HOST: z.string(),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
});

export type Environment = z.infer<typeof _>;
export const ENV = _.parse(process.env);
