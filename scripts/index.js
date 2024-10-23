"use strict";



const mainLink = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json";
const coursesPartialLink = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course"; // add "${courseId}.json" to the end
const courses = await dataFromUrl(mainLink);
const players = [];
let currentCourse = null;
let currentTee = null;
let currentHole = 0;

// also put this class definition somewhere else probably
class Player {
    constructor(name) {
        this.name = name;
        this.id = this.generateUniqueId();
        this.scores = [];
    }

    // Function to generate a unique ID
    generateUniqueId() {
        let id;
        let isUnique = false;
        while (!isUnique) {
            id = Math.floor(Math.random() * 100); // Random ID between 0 and 99
            isUnique = !players.some(player => player.id === id); // Check for uniqueness
        }
        return id;
    }
}

// put this function into utils or something
async function dataFromUrl(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json(); // data

    } catch (error) {
        console.error("Fetch error: ", error);
        // Fallback or default behavior, depending on your needs:
        return null; // or some default data
    }
}




function createCourseSelect() {
    let newHtml = "";

    for (const course of courses) {
        newHtml += `<option value="${course.id}">${course.name}</option>`;
    }

    document.getElementById("options-container").innerHTML = newHtml;
}
createCourseSelect();

async function createTeeSelect() {
    const selectedCourseId = document.getElementById("options-container").value;
    currentCourse = await dataFromUrl(coursesPartialLink + `${selectedCourseId}.json`);

    let newHtml = "";

    for (const tee of currentCourse.holes[currentHole].teeBoxes) {
        const description = tee.teeType.slice(0, 1).toUpperCase() + tee.teeType.slice(1).toLowerCase();;

        newHtml += `
            <option value="${tee.teeType}">${description}</option>
        `;
    }

    document.getElementById("tee-container").innerHTML = newHtml;
    currentTee = document.getElementById("tee-container").value;
}

function createTable() {
    const scorecard = document.getElementById("scorecard"); // Get the existing scorecard element
    scorecard.innerHTML = ''; // Clear any existing content in the scorecard

    // Create a new table element
    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-responsive"); // Add Bootstrap classes

    // Create the table head
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // First cell for the row labels
    const holeHeader = document.createElement("th");
    holeHeader.textContent = "Hole"; // Set the top-left cell to "Hole"
    headerRow.appendChild(holeHeader);

    // Create header cells for the holes
    for (let i = 1; i <= currentCourse.holes.length; i++) {
        const th = document.createElement("th");
        th.textContent = i; // Hole number
        headerRow.appendChild(th);

    }

    // Last cell for the Total column
    const totalHeader = document.createElement("th");
    totalHeader.textContent = "Total";
    headerRow.appendChild(totalHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement("tbody");
    tbody.id = "score-table-body"

    // Create rows for Tee, Yardage, Par, and Handicap
    const rowTitles = ["Yardage", "Par", "Handicap"];
    for (let i = 0; i < rowTitles.length; i++) {
        const row = document.createElement("tr");

        // First cell for the row title
        const titleCell = document.createElement("td");
        titleCell.textContent = rowTitles[i];
        row.appendChild(titleCell);

        // Add cells for each hole based on the currentCourse and currentTee
        for (let index = 0; index < currentCourse.holes.length; index++) {
            let cell;

            switch (i) {
                case 0: // Yardage
                    cell = document.createElement("td");
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).yards; // Get yardage based on current tee
                    cell.id = `yardage-${index}`; // Set ID for the yardage cell
                    break;

                case 1: // Par
                    cell = document.createElement("td");
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).par; // Get par based on current tee
                    cell.id = `par-${index}`; // Set ID for the par cell
                    break;

                case 2: // Handicap
                    cell = document.createElement("td");
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).hcp; // Get handicap based on current tee
                    cell.id = `hcp-${index}`; // Set ID for the handicap cell
                    break;

                default:
                    break;
            }

            row.appendChild(cell);
        }

        // Last cell for the Total column (leave it empty for now)
        const totalCell = document.createElement("td");
        totalCell.id = `total-${i}`
        const cells = row.querySelectorAll("td");

        let total = 0;
        for (let j = 0; j < cells.length; j++) {
            const num = parseInt(cells[j].textContent);

            if (typeof num === "number" && num) {
                total += num;
            }
        }
        totalCell.textContent = total !== 0 ? total : "";


        row.appendChild(totalCell);

        tbody.appendChild(row);
    }


    table.appendChild(tbody);
    scorecard.appendChild(table); // Append the table to the scorecard
}



function addAPlayer() {
    // IMPORTANT
    /* this needs to be rewritten to automatically add these rows based on the number of players that exist in the createTable function
        the addition here should be a lot easier

        create a player
        append player to players list
        call createTable()
    */
    if (players.length < 4) {
        // create one row of inputs for a player
        const player = new Player("Click to name player");
        const playerRow = document.createElement("tr");

        // First cell for the player's name
        const nameCell = document.createElement("td");
        const input = document.createElement("input");

        nameCell.addEventListener("click", () => { input.focus(); input.select(); });

        input.type = "text";
        input.value = player.name;
        input.style.textAlign = "center";
        input.style.border = 0;
        input.style.outline = "none";
        input.style.width = "min-content";
        input.addEventListener("input", () => player.name = input.value);

        nameCell.appendChild(input);
        playerRow.appendChild(nameCell);

        // Create input cells for each hole
        for (let i = 0; i < currentCourse.holes.length; i++) {
            const scoreCell = document.createElement("td");


            const input = document.createElement("input");
            input.style.padding = 0;
            input.style.border = 0;
            input.style.textAlign = "center";
            input.style.outline = "none";
            input.style.width = "100%";

            scoreCell.addEventListener("click", () => input.focus());

            input.type = "number";
            input.id = `${player.name}-score-${i}`;
            input.min = 0;

            // push default values (0)
            player.scores.push(0);

            // Update the player's score when the input value changes
            input.addEventListener("input", (event) => {
                player.scores[i] = parseInt(event.target.value, 10) || 0; // Update score, or default to 0 if input is empty
                updatePlayerTotal(player); // Call the function to update the player's total score
            });

            scoreCell.appendChild(input);
            playerRow.appendChild(scoreCell);
        }

        // Last cell for the player's total score
        const totalCell = document.createElement("td");
        totalCell.id = `${player.name}-total`;
        totalCell.textContent = "0"; // Default total is 0
        playerRow.appendChild(totalCell);

        players.push(player);
        // Append the player row to the table body
        document.getElementById("score-table-body").appendChild(playerRow);

        // Function to update player's total score
        function updatePlayerTotal(player) {
            const total = player.scores.reduce((acc, score) => Number(acc) + Number(score), 0);
            document.getElementById(`${player.name}-total`).textContent = total;
        }

    }
}

async function updateEverything() {
    createCourseSelect();
    await createTeeSelect();
    createTable();
}

async function checkForCourseChange() {
    if (currentCourse === null) {
        await updateEverything();
        return;
    }
    await createTeeSelect();
    createTable();
}

function checkForTeeChange() {
    currentTee = document.getElementById("tee-container").value;
    createTable();
}

document.getElementById("player-add-button").addEventListener("click", addAPlayer);
document.getElementById("options-container").addEventListener("change", checkForCourseChange);
document.getElementById("tee-container").addEventListener("change", checkForTeeChange);


// create stuff on the page initially
await updateEverything();