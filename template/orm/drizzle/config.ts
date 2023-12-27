import { Config, defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./src/drizzle.schema.ts",
  out: "drizzle",
}) satisfies Config;
