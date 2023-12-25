import chalk from "chalk";

export const logger = {
  error(...args: unknown[]) {
    console.log(chalk.white(chalk.bgRed(...args)));
  },
  warn(...args: unknown[]) {
    console.log(chalk.white(chalk.bgYellow(...args)));
  },
  info(...args: unknown[]) {
    console.log(chalk.white(chalk.bgBlue(...args)));
  },
  success(...args: unknown[]) {
    console.log(chalk.white(chalk.bgGreen(...args)));
  },
};
