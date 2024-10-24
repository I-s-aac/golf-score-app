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

    for (let i = 0; i < players.length; i++) {
        players[i].scores = [];
    }

    const scorecard = document.getElementById("scorecard");
    scorecard.innerHTML = ''; // Clear any existing content

    const table = document.createElement("table");
    table.classList.add("table", "table-bordered", "table-responsive");

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // First header cell (for Hole labels)
    const holeHeader = document.createElement("th");
    holeHeader.textContent = "Hole";
    headerRow.appendChild(holeHeader);

    // Create header cells for the holes
    for (let i = 1; i <= currentCourse.holes.length; i++) {
        const th = document.createElement("th");
        th.textContent = i;
        headerRow.appendChild(th);

        // Add "Out" after the 9th hole
        if (i === 9) {
            const outHeader = document.createElement("th");
            outHeader.textContent = "Out";
            headerRow.appendChild(outHeader);
        }
    }

    // Add "In" column after the last hole
    const inHeader = document.createElement("th");
    inHeader.textContent = "In";
    headerRow.appendChild(inHeader);

    // Last column for the total
    const totalHeader = document.createElement("th");
    totalHeader.textContent = "Total";
    headerRow.appendChild(totalHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    // Row titles: Yardage, Par, Handicap

    const rowTitles = ["Yardage", "Par", "Handicap"];
    for (let i = 0; i < rowTitles.length; i++) {
        const row = document.createElement("tr");

        // Row label
        const titleCell = document.createElement("td");
        titleCell.textContent = rowTitles[i];
        row.appendChild(titleCell);

        // Add cells for each hole
        let frontNineTotal = 0;
        let backNineTotal = 0;
        for (let index = 0; index < currentCourse.holes.length; index++) {
            let cell = document.createElement("td");

            switch (i) {
                case 0: // Yardage
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).yards;
                    break;
                case 1: // Par
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).par;
                    break;
                case 2: // Handicap
                    cell.textContent = currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === currentTee).hcp;
                    break;
            }

            row.appendChild(cell);

            // Calculate the front nine and back nine totals
            const numValue = parseInt(cell.textContent);
            if (index < 9) {
                frontNineTotal += numValue;
            } else {
                backNineTotal += numValue;
            }

            // Add "Out" after the 9th hole
            if (index === 8) {
                const outCell = document.createElement("td");
                outCell.textContent = frontNineTotal;
                row.appendChild(outCell);
            }
        }

        // Add "In" and "Total" columns
        const inCell = document.createElement("td");
        inCell.textContent = backNineTotal;
        row.appendChild(inCell);

        const totalCell = document.createElement("td");
        totalCell.textContent = frontNineTotal + backNineTotal;
        row.appendChild(totalCell);

        tbody.appendChild(row);
    }

    // Function to update a player's total score
    function updatePlayerTotal(index) {
        const frontNine = players[index].scores.slice(0, 9).reduce((a, b) => a + b, 0);
        const backNine = players[index].scores.slice(9, 18).reduce((a, b) => a + b, 0);

        document.getElementById(`${players[index].id}-out`).textContent = frontNine;
        document.getElementById(`${players[index].id}-in`).textContent = backNine;
        document.getElementById(`${players[index].id}-total`).textContent = frontNine + backNine;
    }

    // Append the player rows like before, including "Out", "In", and "Total" score columns
    for (let i = 0; i < players.length; i++) {
        const playerRow = document.createElement("tr");

        playerRow.style.borderTop = "2px solid black";

        const nameCell = document.createElement("td");
        const input = document.createElement("input");

        nameCell.addEventListener("click", () => { input.focus(); input.select(); });

        input.type = "text";
        input.value = players[i].name;
        input.style.textAlign = "center";
        input.style.border = 0;
        input.style.outline = "none";
        input.style.width = "min-content";

        input.addEventListener("input", () => players[i].name = input.value);
        input.addEventListener("click", () => { input.focus(); input.select(); });

        nameCell.appendChild(input);
        playerRow.appendChild(nameCell);


        // Create input cells for each hole
        for (let j = 0; j < currentCourse.holes.length; j++) {
            const scoreCell = document.createElement("td");
            const scoreInput = document.createElement("input");

            scoreInput.value = 0;
            scoreInput.style.textAlign = "center";
            scoreInput.type = "number";
            scoreInput.style.outline = "none";
            scoreInput.style.border = 0;
            scoreInput.style.width = "100%";
            scoreInput.style.backgroundColor = "transparent";

            scoreInput.addEventListener("input", (event) => {
                const score = parseInt(event.target.value) || 0;
                players[i].scores[j] = score;
                updatePlayerTotal(i);
            });

            scoreInput.addEventListener("click", () => scoreInput.select());
            scoreCell.addEventListener("click", () => { scoreInput.focus(); scoreInput.select(); });

            scoreCell.appendChild(scoreInput);
            playerRow.appendChild(scoreCell);



            // Add "Out" column after 9th hole
            if (j === 8) {
                const outCell = document.createElement("td");
                outCell.textContent = 0;
                outCell.id = `${players[i].id}-out`;
                outCell.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
                playerRow.appendChild(outCell);
            }
        }

        // Add "In" and "Total" columns
        const inCell = document.createElement("td");
        inCell.id = `${players[i].id}-in`
        inCell.textContent = 0;
        inCell.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
        playerRow.appendChild(inCell);

        const totalCell = document.createElement("td");
        totalCell.id = `${players[i].id}-total`;
        totalCell.textContent = 0;

        playerRow.appendChild(totalCell);
        tbody.appendChild(playerRow);
    }

    table.appendChild(tbody);
    scorecard.appendChild(table);
}



function addAPlayer() {
    if (players.length < 4) {
        const player = new Player("Click/Tap to name player");
        players.push(player);
        createTable();
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