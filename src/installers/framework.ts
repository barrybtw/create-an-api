import { logger } from "@/utils/logging.js";
import { type Options } from "./index.js";
import path from "path";
import { PKG_ROOT } from "@/constants.js";

type Framework = Pick<Options, "http_framework"> & {
  app_dir: string;
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
};
