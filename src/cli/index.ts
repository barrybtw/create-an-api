import { CREATE_MALDINI, DEFAULT_APP_NAME } from "@/constants.js";
import { get_current_version } from "@/utils/get_current_version.js";
import { get_users_package_manager } from "@/utils/get_package_manager.js";
import { validate_app_name } from "@/utils/validate_app_name.js";

import * as p from "@clack/prompts";
import { Command } from "commander";

interface CLIFLags {
  no_git: boolean;
  no_install: boolean;
  import_alias: string;
}

const Packages = ["thing"] as const;
type Available_Packages = (typeof Packages)[number];

interface CLIResults {
  app_name: string;
  flags: CLIFLags;
  packages: Available_Packages[];
}

const default_options: CLIResults = {
  app_name: DEFAULT_APP_NAME,
  flags: {
    no_git: false,
    no_install: false,
    import_alias: "@/",
  },
  packages: [],
};

async function run_the_cli(): Promise<CLIResults> {
  const cli_results = default_options;
  const program = new Command()
    .name(CREATE_MALDINI)
    .description("Create a new Maldini project")
    .argument("[dir]", "Directory to create the project in")
    .option("--noGit", "Don't initialize a git repository", false)
    .option("--noInstall", "Don't install dependencies", false)
    .option("-i, --import_alias", "Import alias for your project", "@/")
    .version(
      get_current_version(),
      "-v, --version",
      "Output the current version"
    )
    .parse(process.argv);

  const provided_name = program.args[0];
  if (provided_name) {
    cli_results.app_name = provided_name;
  }

  cli_results.flags = program.opts();

  const package_manager = get_users_package_manager();

  const project = await p.group(
    {
      ...(!provided_name && {
        name: () =>
          p.text({
            message: "What is the name of your project?",
            defaultValue: provided_name,
            validate: validate_app_name,
          }),
      }),
    },
    {
      onCancel() {
        process.exit(1);
      },
    }
  );

  const packages: Available_Packages[] = [];

  //
  return {
    app_name: project.name ?? cli_results.app_name,
    packages,
    flags: cli_results.flags,
  };
}

export { run_the_cli };
