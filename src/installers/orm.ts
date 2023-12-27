import { Options } from "./index.js";

type Framework = Pick<Options, "orm"> & {
  app_dir: string;
  scoped_app_name: string;
};
type ORMInstaller = (props: Framework) => Promise<void>;

export const install_orm: ORMInstaller = async (props) => {};
