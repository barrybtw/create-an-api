const PackageManager = {
  npm: "npm",
  pnpm: "pnpm",
  yarn: "yarn",
  bun: "bun",
} as const;
export type PackageManager =
  (typeof PackageManager)[keyof typeof PackageManager];

const package_managers = {
  yarn: "yarn",
  pnpm: "pnpm",
  bun: "bun",
  npm: "npm",
} as const;

export const get_users_package_manager: () => PackageManager = () => {
  const user_agent = process.env.npm_config_user_agent;

  for (const [prefix, pkgManager] of Object.entries(package_managers)) {
    if (user_agent?.startsWith(prefix)) {
      return pkgManager;
    }
  }

  return "npm";
};
