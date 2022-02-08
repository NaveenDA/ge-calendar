import zones from "./timezones.json";

class DateTimeService {
    // all timezone
    public static getTimezones() {
        return zones;
    }

    // create date from string date and time
    public static createDate(date: string, time: string) {
        let dateTime = date + " " + time;
        return new Date(dateTime);
    }

    // get current date for timezone
    public static getCurrentDate(timezone: string) {
        let date = new Date();
        date.toLocaleDateString("en-US", { timeZone: timezone });
        return date;
    }


    // get current time for timezone
    public static getCurrentTime(date: string, time: string, timezone: string) {
        let dateTime = date + " " + time;
        let dateTimeZone = new Date(dateTime);
        dateTimeZone.toLocaleDateString("en-US", { timeZone: timezone });
        return dateTimeZone;
    }

    public static getMonth(date:Date,timezone: string) {
        date.toLocaleDateString("en-US", { timeZone: timezone });
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[date.getMonth()];
    }

    public static getCurrentYear(date:Date,timezone: string) {
        date.toLocaleDateString("en-US", { timeZone: timezone });
        return date.getFullYear();
    }

    public static getDateforTimezone(date:Date,timezone: string) {
       return new Date(date.toLocaleString("en-US", {timeZone: timezone}))
    }

    // number of days in month
    public static getDaysInMonth(date: Date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();  
    }

    //date is today
    public static isToday(date: Date, timezone:string) {
        let today = new Date();
        today.toLocaleDateString("en-US", { timeZone: timezone });
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    }

}


export default DateTimeService;