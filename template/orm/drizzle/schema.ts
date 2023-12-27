import { mysqlTable, bigint, varchar } from "drizzle-orm/mysql-core";

export const example = mysqlTable("example", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
});
