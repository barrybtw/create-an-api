#!/usr/bin/env node

import { get_users_package_manager } from "@/utils/get_package_manager.js";
import { logger } from "@/utils/logging.js";
import { run_the_cli } from "./cli/index.js";

async function main() {
  // For the future, get the version of the CLI and check if it's up to date, if not then prompt the user to update
  const package_manager = get_users_package_manager();
  logger.info(`Using ${package_manager} as package manager`);

  const {
    app_name,
    options: { http_framework },
    flags: { import_alias, no_git, no_install },
  } = await run_the_cli();

  logger.info(`Creating new Maldini project in ${app_name}`);
  logger.info(`Using ${import_alias} as import alias`);
  logger.info(`Git: ${no_git ? "No" : "Yes"}`);
  logger.info(`Install: ${no_install ? "No" : "Yes"}`);
  logger.info(`HTTP Framework: ${http_framework}`);
}

main().catch((process_error) => {
  logger.error(process_error);
});
