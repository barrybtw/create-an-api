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

const HTTP_Frameworks = ["elysia", "express"] as const;
type Available_HTTP_Frameworks = (typeof HTTP_Frameworks)[number];

interface Options {
  http_framework: Available_HTTP_Frameworks;
}

interface CLIResults {
  app_name: string;
  flags: CLIFLags;
  options: Options;
}

const default_options: CLIResults = {
  app_name: DEFAULT_APP_NAME,
  flags: {
    no_git: false,
    no_install: false,
    import_alias: "@/",
  },
  options: {
    http_framework: "express",
  },
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
            defaultValue: cli_results.app_name,
            placeholder: cli_results.app_name,
            validate: validate_app_name,
          }),
      }),
      http_framework: () =>
        p.select({
          message: "Which http framework would you like to use?",
          options: [
            { value: "express", label: "Express.js" } as const,
            { value: "elysia", label: "Elysia.js" } as const,
          ] as const,
          initialValue: "express",
        }),
    },
    {
      onCancel() {
        process.exit(1);
      },
    }
  );

  //
  return {
    app_name: project.name ?? cli_results.app_name,
    flags: cli_results.flags,
    options: {
      http_framework: project.http_framework as Available_HTTP_Frameworks,
    },
  };
}

export { run_the_cli };
