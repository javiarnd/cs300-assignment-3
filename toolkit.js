//This function validates a record object to ensure it has the required properties and that they are of the correct type for the minutes one. It returns an object that shows the record is valid and also gives the errors found. Doesnt change input.
export function validateRecord(record) {
    const errors = [];

    if(!record.id){
        errors.push("Missing id");
    }

    if(!record.title){
        errors.push("Missing title");
    }

    if(!record.creator){
        errors.push("Missing creator");
    }

    if(!record.category){
        errors.push("Missing category");
    }

    if(typeof record.minutes !== 'number' || record.minutes < 0){
        errors.push("Invalid minutes");
    }

    return{
        valid: errors.length === 0, errors: errors
    };
}

//This function 'normalizes' a record object by trimming whitespace and fixing capitalization for the title, creator, and category properties. It returns a new object with the cleaned up values. Doesnt change input.
export function normalizeRecord(record) {
    const normalizedRecord = { ...record };

    if (normalizedRecord.title) {
        normalizedRecord.title = normalizedRecord.title.trim().toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    if (normalizedRecord.creator) {
        normalizedRecord.creator = normalizedRecord.creator.trim().toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    if (normalizedRecord.category) {
        normalizedRecord.category = normalizedRecord.category.trim().toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }

    return normalizedRecord;
}

//This function filters an array based on a provided condition. It returns a new array containing only the records that meet the condition. The condition is cleaned up first. Doesnt change input.
export function filterRecords(records, condition) {
    return records.filter(condition);
}

export function searchRecords(records, query) {
    const cleanQuery = query.trim().toLowerCase();
    return records.filter(record => 
        (record.title && record.title.toLowerCase().includes(cleanQuery)) ||
        (record.creator && record.creator.toLowerCase().includes(cleanQuery)) ||
        (record.category && record.category.toLowerCase().includes(cleanQuery))
    );
}

//This function sorts an array based on a specified property. It returns a new array with the records sorted by the given property. If two records have the same value for the property, they are sorted by title as a tie-breaker. Doesnt change input.
export function sortRecords(records, property) {
    const sortedRecords = [...records];
    sortedRecords.sort((a, b) => {
        const valA = a[property];
        const valB = b[property];

        if (typeof valA === "string" && typeof valB === "string") {
            return valA.localeCompare(valB);
        } else if (typeof valA === "number" && typeof valB === "number") {
            if (valA === valB) {
                return a.title.localeCompare(b.title); // Tie rule.
            }
            return valA - valB;
        } else {
            return 0; //If titles are the same also just retun 0, default js sort.
        }
    });
    return sortedRecords;
}

//This function summarizes an array of records by calculating the count, total minutes, and average minutes. It returns an object containing these summary statistics. Doesnt change input.
export function summarizeRecords(records) {
    if (records.length === 0) {
        return { count: 0, totalMinutes: 0, averageMinutes: 0};
    }

    const count = records.length;
    const totalMinutes = records.reduce((sum, record) => sum + (typeof record.minutes === 'number' ? record.minutes : 0), 0);
    const averageMinutes = totalMinutes / count;
    
    return { count, totalMinutes, averageMinutes };
}

//This function builds a report based on a query. It filters the records based on the query, sorts the filtered records by title, and summarizes the sorted records. It returns an object containing the filtered records, sorted records, and summary (the stats). Doesnt change input.
export function buildReport(records, query) {
    const filteredRecords = searchRecords(records, query);
    const sortedRecords = sortRecords(filteredRecords, "title");
    const summarizedRecords = summarizeRecords(sortedRecords);
    return { 
        query: filteredRecords,        
        summary: sortedRecords,   
        result: summarizedRecords
    };
}