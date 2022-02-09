
export const createCSV = (data: any[], headers: string[]) => {
    var array = typeof data != 'object' ? JSON.parse(data) : data;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line !== '') {
                line += ','
            }

            line += array[i][index];
        }
        str += line + '\r\n';
    }


    // add header
    str = headers.join(',') + '\r\n' + str;
    return str;
    
}


