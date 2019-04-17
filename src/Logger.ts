import chalk from "chalk"

export class Logger {
  private static display(date: string, type: string, message: string): void {
      console.log(date + " : " + type + " : " + message);
  }

  private static getDate(): string {
      let today = new Date();
      let dayS = "000" + today.getDate();
      let day = dayS.substring(dayS.length - 2, dayS.length);
      let monthS = "000" + (today.getMonth() + 1);
      let month = monthS.substring(monthS.length - 2, monthS.length);
      let formattedDate = month + "/" + day + "/" + today.getFullYear();

      let h = "000" + today.getHours();
      let hours = h.substring(h.length - 2, h.length);
      let m = "000" + today.getMinutes();
      let mins = m.substring(m.length - 2, m.length);
      let s = "000" + today.getSeconds();
      let secs = s.substring(s.length - 2, s.length);
      let ms = "000" + today.getMilliseconds();
      let msecs = ms.substring(ms.length - 3, ms.length);

      return "[" + formattedDate + " " + hours + ":" + mins + ":" + secs + "." + msecs + "]";
  }

  public static info(message: string): void {
      Logger.display(chalk.green(Logger.getDate()), chalk.green("INFO"), chalk.green(message));
  }

  public static warning(message: string): void {
      Logger.display(chalk.yellow(Logger.getDate()), chalk.yellow("WARNING"), chalk.yellow(message));
  }

  public static error(message: string): void {
      Logger.display(chalk.red(Logger.getDate()), chalk.red("ERROR"), chalk.red(message));
  }

  public static debug(message: string): void {
      Logger.display(chalk.blue(Logger.getDate()), chalk.blue("DEBUG"), chalk.blue(message));
  }
}

