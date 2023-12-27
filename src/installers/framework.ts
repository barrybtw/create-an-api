import { logger } from "@/utils/logging.js";
import { type Options } from "./index.js";
import path from "path";
import fs from "fs-extra";
import { PKG_ROOT } from "@/constants.js";
import { type MaldiniJson } from "@/index.js";
import { get_current_version } from "@/utils/get_current_version.js";
import * as p from "@clack/prompts";

type Framework = Pick<Options, "http_framework"> & {
  app_dir: string;
  scoped_app_name: string;
};
type FrameworkInstaller = (props: Framework) => Promise<void>;

export const install_http_framework: FrameworkInstaller = async (props) => {
  logger.info(`Installing ${props.http_framework}`);

  // Figure out which folder to copy from
  const framework_dir = path.join(
    PKG_ROOT,
    "template",
    props.http_framework + "-base"
  );

  // Check if a folder with the name app_dir already exists
  if (fs.existsSync(props.app_dir)) {
    // Check if it's empty
    if (fs.readdirSync(props.app_dir).length === 0) {
      // If it's empty, log a warning and continue
      logger.warn(
        `The folder ${props.app_dir} is empty, continuing with installation`
      );
    } else {
      // If it's not empty, prompt if the user wants to continue
      const continue_installation = await p.confirm({
        message: `The folder ${props.app_dir} is not empty, continue with installation?`,
        initialValue: false,
      });

      if (!continue_installation) {
        logger.info("Aborting installation");
        process.exit(0);
      }

      // If the user wants to continue, empty the folder
      fs.emptyDirSync(props.app_dir);
    }
  }

  // Copy the template into folder
  fs.copySync(framework_dir, props.app_dir);

  // Rename the gitignore file
  fs.renameSync(
    path.join(props.app_dir, "_gitignore"),
    path.join(props.app_dir, ".gitignore")
  );

  // Rewrite package.json
  const package_json_path = path.join(props.app_dir, "package.json");
  const package_json = fs.readJsonSync(package_json_path) as MaldiniJson;
  package_json.name = props.scoped_app_name;
  package_json.maldiniMetadata = {
    maldiniVersion: get_current_version(),
  };

  // Write the new package.json
  fs.writeJsonSync(package_json_path, package_json, { spaces: 2 });

  // Finish
  logger.info(`Finished installing ${props.http_framework}`);
  return;
};
