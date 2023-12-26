#!/usr/bin/env node

import { get_users_package_manager } from "@/utils/get_package_manager.js";
import { logger } from "@/utils/logging.js";
import { run_the_cli } from "./cli/index.js";
import { parse_name_and_path } from "./utils/parse_name_and_path.js";
import fs from "fs-extra";
import path from "path";
import { PKG_ROOT } from "./constants.js";
import { PackageJson } from "type-fest";
import { get_current_version } from "./utils/get_current_version.js";

type MaldiniJson = PackageJson & {
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
    options: { http_framework, runtime, orm },
    flags: { import_alias, no_git, no_install },
  } = await run_the_cli();

  const [scopedAppName, appDir] = parse_name_and_path(app_name);

  logger.info(`Creating new Maldini project in ${app_name}`);
  logger.info(`Using ${import_alias} as import alias`);
  logger.info(`Git: ${no_git ? "No" : "Yes"}`);
  logger.info(`Install: ${no_install ? "No" : "Yes"}`);
  logger.info(`HTTP Framework: ${http_framework}`);
  logger.info(`Runtime: ${runtime}`);
  logger.info(`ORM: ${orm}`);
  logger.info(`Scoped App Name: ${scopedAppName}`);
  logger.info(`App Directory: ${appDir}`);

  if (http_framework === "express") {
    if (runtime == "node") {
      // Make a folder called app_name
      fs.mkdirsSync(appDir);
      const dir = path.join(PKG_ROOT, "template", "express-node-base");

      // Copy express-node-base template into app_name
      fs.copySync(dir, appDir);
      fs.renameSync(
        path.join(appDir, "_gitignore"),
        path.join(appDir, ".gitignore")
      );
      // Replace all instances of express-node-base with app_name
      // If no_git is false, then initialize git
      // If no_install is false, then install dependencies
    }
  }

  // Write name to package.json
  const pkgJson = fs.readJSONSync(
    path.join(appDir, "package.json")
  ) as MaldiniJson;
  pkgJson.name = scopedAppName;
  pkgJson.maldiniMetadata = { maldiniVersion: get_current_version() };

  fs.writeJsonSync(path.join(appDir, "package.json"), pkgJson, {
    spaces: 2,
  });

  process.exit(0);
}

main().catch((process_error) => {
  logger.error(process_error);
});
