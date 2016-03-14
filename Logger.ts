export class Logger {
    private static log(type: string, message: string): void {
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

        console.log("[" + formattedDate + " " + hours + ":" + mins + ":" + secs + "." + msecs + "] :  " + type + " : " + message);
    }

    public static info(message: string): void {
        Logger.log("INFO", message);
    }

    public static warning(message: string): void {
        Logger.log("WARNING", message);
    }

    public static error(message: string): void {
        Logger.log("ERROR", message);
    }

    public static debug(message: string): void {
        Logger.log("DEBUG", message);
    }
}
