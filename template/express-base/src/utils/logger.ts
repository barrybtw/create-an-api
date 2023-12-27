import chalk from "chalk";

export const logger = {
  info: (...message: string[]) => console.log(chalk.blue(...message)),
  warn: (...message: string[]) => console.log(chalk.yellow(...message)),
  error: (...message: string[]) => console.log(chalk.red(...message)),
  success: (...message: string[]) => console.log(chalk.green(...message)),
};
