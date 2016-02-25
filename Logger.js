var Logger = (function () {
    function Logger() {
    }
    Logger.log = function (type, message) {
        var today = new Date();
        var dayS = "000" + today.getDate();
        var day = dayS.substring(dayS.length - 2, dayS.length);
        var monthS = "000" + (today.getMonth() + 1);
        var month = monthS.substring(monthS.length - 2, monthS.length);
        var formattedDate = month + "/" + day + "/" + today.getFullYear();
        var h = "000" + today.getHours();
        var hours = h.substring(h.length - 2, h.length);
        var m = "000" + today.getMinutes();
        var mins = m.substring(m.length - 2, m.length);
        var s = "000" + today.getSeconds();
        var secs = s.substring(s.length - 2, s.length);
        var ms = "000" + today.getMilliseconds();
        var msecs = ms.substring(ms.length - 3, ms.length);
        console.log("[" + formattedDate + " " + hours + ":" + mins + ":" + secs + "." + msecs + "] : " + type + " : " + message);
    };
    Logger.info = function (message) {
        Logger.log("INFO", message);
    };
    Logger.warning = function (message) {
        Logger.log("WARNING", message);
    };
    Logger.error = function (message) {
        Logger.log("ERROR", message);
    };
    Logger.debug = function (message) {
        Logger.log("DEBUG", message);
    };
    return Logger;
})();
module.exports = Logger;
//# sourceMappingURL=Logger.js.map