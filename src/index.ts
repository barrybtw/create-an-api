#!/usr/bin/env node

import { get_users_package_manager } from "@/utils/get_package_manager.js";
import { logger } from "@/utils/logging.js";
import { run_the_cli } from "./cli/index.js";
import { parse_name_and_path } from "./utils/parse_name_and_path.js";
import { PackageJson } from "type-fest";
import { install_http_framework } from "./installers/framework.js";
import { installDependencies } from "./helpers/install_dependencies.js";
import { install_orm } from "./installers/orm.js";

export type MaldiniJson = PackageJson & {
  maldiniMetadata?: {
    maldiniVersion: string;
  };
};

async function main() {
  // For the future, get the version of the CLI and check if it's up to date, if not then prompt the user to update
  const package_manager = get_users_package_manager();
  logger.info(`Using ${package_manager} as package manager`);

  const {
    app_name,
    options: { http_framework, orm },
    flags: { import_alias, no_install },
  } = await run_the_cli();

  const [scoped_app_name, app_dir] = parse_name_and_path(app_name);

  await install_http_framework({
    app_dir: app_dir,
    scoped_app_name: scoped_app_name,
    http_framework: http_framework,
  });

  await install_orm({
    app_dir: app_dir,
    scoped_app_name: scoped_app_name,
    orm: orm,
  });

  // If import_alias is different from the default, then rewrite the tsconfig.json file
  if (import_alias !== "@/") {
    logger.info("Rewriting tsconfig.json");
  }

  // If !no_install, run the package manager install command
  if (!no_install) {
    logger.info("Installing dependencies");
    installDependencies({ projectDir: app_dir });
    // do stuff
  }

  process.exit(0);
}

main().catch((process_error) => {});
