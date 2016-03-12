export class Logger {
    private static log(type:string, message:string):void{
        var today = new Date();
        var dayS = "000" + today.getDate();
        var day = dayS.substring(dayS.length - 2, dayS.length);
        var monthS = "000" + (today.getMonth() + 1);
        var month = monthS.substring(monthS.length - 2, monthS.length);
        var formattedDate = month + "/" + day + "/" + today.getFullYear();

        var h = "000"+today.getHours();
        var hours = h.substring(h.length - 2, h.length);
        var m = "000"+today.getMinutes();
        var mins = m.substring(m.length - 2, m.length);
        var s = "000"+today.getSeconds();
        var secs = s.substring(s.length - 2, s.length);
        var ms = "000"+today.getMilliseconds();
        var msecs = ms.substring(ms.length - 3, ms.length);

        console.log("["+formattedDate+" "+hours+":"+mins+":"+secs+"."+msecs+"] : "+type+" : "+message);
    }

    public static info(message:string):void{
        Logger.log("INFO", message);
    }

    public static warning(message:string):void{
        Logger.log("WARNING", message);
    }

    public static error(message:string):void{
        Logger.log("ERROR", message);
    }

    public static debug(message:string):void{
        Logger.log("DEBUG", message);
    }
}
