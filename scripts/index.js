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
        this.scores = [];
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

    // Create rows for Tee, Yardage, Par, and Handicap
    const rowTitles = ["Tee", "Yardage", "Par", "Handicap"];
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
                case 0: // Tee
                    cell = document.createElement("td");
                    cell.textContent = currentTee.slice(0, 1).toUpperCase() + currentTee.slice(1).toLowerCase();
                    cell.id = `tee-${index}`; // Set ID for the tee cell
                    break;

                case 1: // Yardage
                    cell = document.createElement("td");
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).yards; // Get yardage based on current tee
                    cell.id = `yardage-${index}`; // Set ID for the yardage cell
                    break;

                case 2: // Par
                    cell = document.createElement("td");
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).par; // Get par based on current tee
                    cell.id = `par-${index}`; // Set ID for the par cell
                    break;

                case 3: // Handicap
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
        row.appendChild(totalCell);

        tbody.appendChild(row);
    }

    // create one row of inputs for a player
    const player = new Player("playerName");
    function test() {
        // create one row of inputs for a player
        const playerRow = document.createElement("tr");

        // First cell for the player's name
        const nameCell = document.createElement("td");
        nameCell.textContent = player.name;
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

            scoreCell.addEventListener("click", () => {
                input.focus();
            });

            input.type = "number";
            input.id = `${player.name}-score-${i}`;
            input.min = 0;
            input.value = 0; // Default value is 0

            // Push the value of the input to the player's score array
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

        // Append the player row to the table body
        tbody.appendChild(playerRow);

        // Function to update player's total score
        function updatePlayerTotal(player) {
            const total = player.scores.reduce((acc, score) => Number(acc) + Number(score), 0);
            document.getElementById(`${player.name}-total`).textContent = total;
        }

    }
    test();
    players.push(player);

    table.appendChild(tbody);
    scorecard.appendChild(table); // Append the table to the scorecard
}




function updateTable() {
    // update some part of the table using currentHole
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

async function checkForTeeChange() {
    createTable(); // maybe make a new function to only change the data within the table at whatever the current hole
}

document.getElementById("options-container").addEventListener("change", checkForCourseChange)


// create stuff on the page initially
updateEverything();