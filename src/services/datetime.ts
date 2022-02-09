class DateTimeService {

    public static getMonth(date: Date, timezone: string) {
        date.toLocaleDateString("en-US", { timeZone: timezone });
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        return monthNames[date.getMonth()];
    }

    public static getCurrentYear(date: Date, timezone: string) {
        date.toLocaleDateString("en-US", { timeZone: timezone });
        return date.getFullYear();
    }

    public static getDateforTimezone(date: Date, timezone: string) {
        return new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    }

    // number of days in month
    public static getDaysInMonth(date: Date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    //date is today
    public static isToday(date: Date, timezone: string) {
        let today = new Date();
        today.toLocaleDateString("en-US", { timeZone: timezone });
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    }


    // format date
    public static format(date: Date, format: string) {
        let data: any = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "y+": date.getFullYear(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "a+": date.getHours() > 12 ? "PM" : "AM",
        };
        if (/(y+)/.test(format)) {
            format = format.replace(
                RegExp.$1,
                (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        }
        for (let key in data) {
            if (new RegExp("(" + key + ")").test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? data[key]
                        : ("00" + data[key]).substr(("" + data[key]).length)
                );
            }
        }
        return format;
    }
}

export default DateTimeService;
