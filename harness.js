import { validateRecord } from "./toolkit.js";

function check(name, expected, actual) {
 const result = JSON.stringify(actual) === JSON.stringify(expected) ? "PASS" :
 "FAIL";
 
 console.log(`${result} ${name} expected: ${JSON.stringify(expected)} actual: ${JSON.stringify(actual)}`);

 const printedResult = document.createElement("p");
    printedResult.innerHTML = `${result} <br> ${name} 
                                <br> &nbsp;&nbsp;expected: ${JSON.stringify(expected)} 
                                <br> &nbsp;&nbsp;actual: ${JSON.stringify(actual)}`;
    document.body.appendChild(printedResult);
}

const gamesResponse = await fetch("data/games.json");
const games = await gamesResponse.json();

const boundaryResponse = await fetch("data/boundary-records.json");
const boundaryRecords = await boundaryResponse.json();

const validationResult = validateRecord(games[0]);
check("validateRecord with valid record", { valid: true, errors: [] }, validationResult);

const invalidResult = validateRecord(boundaryRecords[1]);
check("validateRecord with invalid invalid minutes type", { valid: false, errors: ["Invalid Minutes"] }, invalidResult);

