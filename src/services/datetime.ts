import zones from "./timezones.json";

class DateTimeService{
    // all timezone
    public static getTimezones(){
        return zones;
    }

    // create date from string date and time
    public static createDate(date: string, time: string){
        let dateTime = date + " " + time;
        return new Date(dateTime);
    }

    // get current date for timezone
    public static getCurrentDate(timezone: string){
        let date = new Date();
        date.toLocaleDateString("en-US", {timeZone: timezone});
        return date;
    }


    // get current time for timezone
    public static getCurrentTime(date:string, time:string,timezone: string){
        let dateTime = date + " " + time;
        let dateTimeZone = new Date(dateTime);
        dateTimeZone.toLocaleDateString("en-US", {timeZone: timezone});
        return dateTimeZone;
    }



}


export default DateTimeService;