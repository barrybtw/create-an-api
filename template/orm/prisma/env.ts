import { z } from "zod";

const _ = z.object({
  NODE_ENV: z.string().default("development"),
  PORT: z.string().default("3000"),
  DATABASE_HOST: z.string().min(1),
  DATABASE_USERNAME: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
});

export type Environment = z.infer<typeof _>;
export const ENV = _.parse(process.env);
