import { CREATE_MALDINI } from "@/constants.js";
import { Command } from "commander";

interface CliFlags {
  no_git: boolean;
  no_install: boolean;
  import_alias: boolean;
}

const Packages = ["thing"] as const;
type Available_Packages = (typeof Packages)[number];

interface CLIResults {
  flags: CliFlags;
  packages: Available_Packages[];
  args: string[];
}

async function run_the_cli(): Promise<CLIResults> {
  const program = new Command()
    .name(CREATE_MALDINI)
    .description("Create a new Maldini project")
    .argument("[dir]", "Directory to create the project in")
    .option("--noGit", "Don't initialize a git repository", false)
    .option("--noInstall", "Don't install dependencies", false)
    .option("-i, --import_alias", "Import alias for your project", "@/")
    .version("0.0.1", "-v, --version", "Output the current version"));
  //
  await Promise.resolve();
  return {
    flags: {
      no_git: true,
      no_install: true,
      import_alias: true,
    },
    packages: ["thing"],
    args: ["thing"],
  };
}

export { run_the_cli };
