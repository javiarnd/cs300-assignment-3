// Assignment 3: JavaScript Data Toolkit
//
// Write and export your seven functions in this file. You may use these names:
//
//   validateRecord(record)            returns useful error information for one record
//   normalizeRecord(record)           returns a cleaned copy; never changes the original record
//   filterRecords(records, condition) returns the records that match a condition you pass in
//   searchRecords(records, query)     matches 2+ properties, ignoring capitalization
//   sortRecords(records, property)    returns a new sorted array; never changes the original array
//   summarizeRecords(records)         returns a summary, such as a count, total, or average
//   buildReport(records, query)       combines at least two of the functions above
//
// Above each function, write a short comment: what it takes, what it returns,
// and whether it changes its input. Decide your tie rule for equal values
// and the shape of your validation errors before you write the code.

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


