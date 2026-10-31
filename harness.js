import { validateRecord, normalizeRecord, filterRecords, searchRecords, sortRecords, summarizeRecords, buildReport } from "./toolkit.js";

function check(name, expected, actual) {
 const result = JSON.stringify(actual) === JSON.stringify(expected) ? "PASS" :
 "FAIL";
 
 console.log(`${result} ${name} expected: ${JSON.stringify(expected)} actual: ${JSON.stringify(actual)}`);

 const printedResult = document.createElement("p");
    printedResult.innerHTML = `${result} <br> <b>${name}</b>
                                <br> &nbsp;&nbsp;expected: ${JSON.stringify(expected)} 
                                <br> &nbsp;&nbsp;actual: ${JSON.stringify(actual)}`;
    document.body.appendChild(printedResult);
}

const gamesResponse = await fetch("data/games.json");
const games = await gamesResponse.json();

const boundaryResponse = await fetch("data/boundary-records.json");
const boundaryRecords = await boundaryResponse.json();

const emptyResponse = await fetch("data/empty.json");
const emptyRecords = await emptyResponse.json();

const incompleteResponse = await fetch("data/incomplete.json");
const incompleteRecords = await incompleteResponse.json();

const validationResult = validateRecord(games[0]);
check("validateRecord with valid record", { valid: true, errors: [] }, validationResult);

const invalidResult = validateRecord(boundaryRecords[1]);
check("validateRecord with invalid invalid minutes type", { valid: false, errors: ["Invalid minutes"] }, invalidResult);

const expectedCleanRecord = {
    "id": "trim-case",
    "title": "Robot Garden",
    "creator": "Mina Reed",
    "category": "Science Fiction",
    "minutes": 240
};

const normalizedRecord = normalizeRecord(boundaryRecords[2]);
check("normalizeRecord cleans whitespace and fixes capitalization", expectedCleanRecord, normalizedRecord);


const categoryCondition = record => record.category === "Puzzle";
const filteredResult = filterRecords(games, categoryCondition);
check("filterRecords filters by category", games.filter(game => game.category === "Puzzle"), filteredResult);

const searchResult = searchRecords(games, "CARDS");
check("searchRecords finds records by 'title', 'creator' or 'category'", games.filter(game => game.title.toLowerCase().includes("cards") || game.creator.toLowerCase().includes("cards") || game.category.toLowerCase().includes("cards")), searchResult);

const sortResult = sortRecords(games, "title");
const expectedSortedResult = [...games].sort((a, b) => a.title.localeCompare(b.title));
check("sortRecords sorts by property, in this case 'title'", expectedSortedResult, sortResult);

const summaryResult = summarizeRecords(games);
const expectedSummary = {
    count: 8,
    totalMinutes: 305,
    averageMinutes: 38.125
};

check("summarizeRecords returns correct summary", expectedSummary, summaryResult);

const reportResult = buildReport(games, "Practice" );
const expectedReport = {
    query: searchRecords(games, "Practice"),
    summary: sortRecords(searchRecords(games, "Practice"), "title"),
    result: summarizeRecords(sortRecords(searchRecords(games, "Practice"), "title"))
};

check("buildReport returns correct report", expectedReport, reportResult);

//Special tests for edge cases

const sortedByMinutes = sortRecords(games, "minutes");
check("sortRecords by minutes puts Cloud Cards (15min) first", games[7], sortedByMinutes[0]);

const puzzleGames = filterRecords(games, game => game.category === "Puzzle");
check("filterRecords Puzzle category returns correct count", 3, puzzleGames.length);

const sixtyMinuteGames = games.filter(game => game.minutes === 60);
check("filterRecords 60min games returns correct count", 2, sixtyMinuteGames.length);

const expectedSixtyMinuteGamesOrder = [
    games[3].title,
    games[1].title
];

check("sortRecords equal min games sort by title instead", expectedSixtyMinuteGamesOrder, sortRecords(sixtyMinuteGames, "minutes").map(game => game.title));

const emptySummary = summarizeRecords(emptyRecords);
check("summarizeRecords handles empty json", { count: 0, totalMinutes: 0, averageMinutes: 0 }, emptySummary);

const emptySearch = searchRecords(emptyRecords, "robot");
check("searchRecords handles empty json", [], emptySearch);

const incompleteValidation = validateRecord(incompleteRecords[0]);
const expectedIncomplete = {
    valid: false,
    errors: ["Missing creator", "Missing category", "Invalid minutes"]
};
check("validateRecord catches multiple missing fields in incomplete records", expectedIncomplete, incompleteValidation);