import path from "path";
import fs from "fs-extra";
import { Options } from "./index.js";
import { MaldiniJson } from "@/index.js";
import sortPackageJson from "sort-package-json";
import { PKG_ROOT } from "@/constants.js";
type Required = {
  app_dir: string;
  scoped_app_name: string;
  dotenv: boolean;
  bun: boolean;
};

type ORM = Pick<Options, "orm"> & Required;
type ORMInstaller = (props: ORM) => Promise<void>;

export const install_orm: ORMInstaller = async (props) => {
  switch (props.orm) {
    case "drizzle":
      await install_drizzle(props);
      break;
    // case "prisma":
    //   await install_prisma(props);
    //   break;
    default:
      break;
  }
};

const install_drizzle = async (props: Required) => {
  const package_json_path = path.join(props.app_dir, "package.json");
  const package_json = fs.readJsonSync(package_json_path) as MaldiniJson;

  package_json.dependencies = {
    ...package_json.dependencies,
    "drizzle-orm": "^0.29.2",
    "@planetscale/database": "^1.13.0",
  };

  package_json.devDependencies = {
    ...package_json.devDependencies,
    "drizzle-kit": "^0.20.8",
  };

  const orm_dir = path.join(PKG_ROOT, "template", "orm", "drizzle");

  const drizzle_config = path.join(orm_dir, "config.ts");
  const drizle_config_dest = path.join(props.app_dir, "drizzle.config.ts");

  const drizzle_schema = path.join(orm_dir, "schema.ts");
  const drizzle_schema_dest = path.join(
    props.app_dir,
    "src",
    "db",
    "drizzle.schema.ts"
  );

  const drizzle_migrator = path.join(orm_dir, "migrate.ts");
  const drizzle_migrator_dest = path.join(
    props.app_dir,
    "src",
    "db",
    "drizzle.migrate.ts"
  );

  const drizzle_instance = path.join(orm_dir, "instance.ts");
  const drizzle_instance_dest = path.join(
    props.app_dir,
    "src",
    "db",
    "drizzle.instance.ts"
  );

  const drizzle_env = path.join(orm_dir, "env.ts");
  const drizzle_env_dest = path.join(props.app_dir, "src", "utils", "env.ts");

  package_json.scripts = {
    ...package_json.scripts,
    "db:push": `${props.dotenv && "dotenv "}drizzle-kit push:mysql`,
    "db:generate": `${props.dotenv && "dotenv "}drizzle-kit generate:mysql`,
    "db:studio": `${props.dotenv && "dotenv "}drizzle-kit studio`,
    "db:migrate": `${props.dotenv && "dotenv "}${
      props.bun
        ? "bun run src/db/drizzle.migrate.ts"
        : "tsx src/db/drizzle.migrate.ts"
    }`,
  };

  const sorted_package_json = sortPackageJson(package_json);

  fs.writeJsonSync(package_json_path, sorted_package_json, { spaces: 2 });

  fs.copySync(drizzle_config, drizle_config_dest);
  fs.copySync(drizzle_schema, drizzle_schema_dest);
  fs.copySync(drizzle_migrator, drizzle_migrator_dest);
  fs.copySync(drizzle_instance, drizzle_instance_dest);
  fs.copySync(drizzle_env, drizzle_env_dest);

  const env_file = path.join(orm_dir, "_env");
  const env_file_dest = path.join(props.app_dir, ".env");
  fs.copySync(env_file, env_file_dest);

  return;
};
export const install_prisma = async (props: Required) => {
  // Abandoned for now
  const package_json_path = path.join(props.app_dir, "package.json");
  const package_json = fs.readJsonSync(package_json_path) as MaldiniJson;

  package_json.dependencies = {
    ...package_json.dependencies,
    prisma: "^5.7.1",
  };

  // TODO
};
