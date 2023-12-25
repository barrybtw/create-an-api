#!/usr/bin/env node

import { get_users_package_manager } from "./utils/get_package_manager.js";
import { logger } from "./utils/logging.js";

async function main() {
  //
  const package_manager = get_users_package_manager();
  logger.info(`Using ${package_manager} as package manager`);
}

main().catch((process_error) => {
  logger.error(process_error);
});
