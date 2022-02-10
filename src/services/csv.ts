
export const createCSV = (data: any[], headers: string[]) => {
    let array = typeof data != 'object' ? JSON.parse(data) : data;
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') {
                line += ','
            }
            let value = array[i][index] || "";
            // value contains comma, so we need to wrap it in quotes
            if (value.includes(',')) {
                value = '"' + value + '"';
            }

            line += value;
        }
        str += line + '\r\n';
    }


    // add header
    str = headers.join(',') + '\r\n' + str;
    return str;
    
}


