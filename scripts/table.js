"use strict";

import {
    // variables
    players,
    courseData
} from "./globalVars.js";

export function createTable() {

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
    for (let i = 1; i <= courseData.currentCourse.holes.length; i++) {
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

        if (rowTitles[i] === "Handicap") {
            row.style.borderBottom = "1px solid black";
        }
        // Row label
        const titleCell = document.createElement("td");
        titleCell.textContent = rowTitles[i];
        row.appendChild(titleCell);

        // Add cells for each hole
        let frontNineTotal = 0;
        let backNineTotal = 0;

        for (let index = 0; index < courseData.currentCourse.holes.length; index++) {
            let cell = document.createElement("td");

            switch (i) {
                case 0: // Yardage
                    cell.textContent = courseData.currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === courseData.currentTee).yards;
                    break;
                case 1: // Par
                    cell.textContent = courseData.currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === courseData.currentTee).par;
                    break;
                case 2: // Handicap
                    cell.textContent = courseData.currentCourse.holes[index].teeBoxes.find(tee => tee.teeType === courseData.currentTee).hcp;
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
        for (let j = 0; j < courseData.currentCourse.holes.length; j++) {
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