import data from "./data.json";


export const getEventsForMonth = (date: Date) => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();

    let results:any={};
    for (let [timestamp, events] of Object.entries(data)) {
        let _timestamp = parseInt(timestamp, 10);
        if(_timestamp > startDate && _timestamp < endDate) {
            // create date with timestamp
            let _date = new Date(_timestamp);
           let _dateString = _date.getDate() + "-" + (_date.getMonth() + 1) + "-" + _date.getFullYear();
           if(!results[_dateString]){
                results[_dateString] = {};
           }
           results[_dateString] = events;
        }
    }
    return results;
}

export const get3MonthsEvents = (date: Date) => {

    let previousMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    return {
        ...getEventsForMonth(previousMonth),
        ...getEventsForMonth(date),
        ...getEventsForMonth(nextMonth)
    }
}

