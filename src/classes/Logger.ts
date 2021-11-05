import chalk from 'chalk';

export default class {
    
    public static error(message: string): void {
        console.log(chalk.grey('[') + chalk.redBright("x") + chalk.grey("]") + " " + message);
    }

    public static success(message: string): void {
        console.log(chalk.grey('[') + chalk.greenBright("✓") + chalk.grey("]") + " " + message);
    }
    
    public static warning(message: string): void {
        console.log(chalk.grey('[') + chalk.yellow("!") + chalk.grey("]") + " " + message);
    }

    public static socket_error(socketId: string, message: string): void {
        console.log(chalk.grey('[') + chalk.redBright("x") + chalk.grey("]") + chalk.grey('[') + chalk.blue(socketId) + chalk.grey(']') + " " + `${message}`);
    }

    public static socket_success(socketId: string, message: string): void {
        console.log(chalk.grey('[') + chalk.greenBright("✓") + chalk.grey("]") + chalk.grey('[') + chalk.blue(socketId) + chalk.grey(']') + " " + `${message}`);
    }
    
    public static socket_warning(socketId: string, message: string): void {
        console.log(chalk.grey('[') + chalk.yellow("!") + chalk.grey("]") + chalk.grey('[') + chalk.blue(socketId) + chalk.grey(']') + " " + `${message}`);
    }
}