"use strict";

import {
    // variables
    coursesPartialLink,
    players,
    courses,
    courseData
} from "./globalVars.js";

import {
    // function
    addAPlayer
} from "./player.js";

import {
    // function
    sanitizeInput
} from "./utils.js"

import {
    // functions
    createTable
} from "./table.js";

import {
    // functions
    createCourseSelect,
    createTeeSelect
} from "./select.js";



async function updateEverything() {
    createCourseSelect();
    await createTeeSelect();
    createTable();
}

async function checkForCourseChange() {
    if (courseData.currentCourse === null) {
        await updateEverything();
        return;
    }
    await createTeeSelect();
    createTable();
    toastr.info("Course updated", null, { closeButton: true }); // Toast notification
}

function checkForTeeChange() {
    courseData.currentTee = document.getElementById("tee-container").value;
    createTable();
    toastr.info("Tee updated", null, { closeButton: true }); // Toast notification
}

async function checkForFinish() {
    // Check if all players have filled their scores with 1 or higher
    let allScoresValid = true;
    for (let i = 0; i < players.length; i++) {
        if (players[i].scores.length !== courseData.currentCourse.holes.length) {
            allScoresValid = false;
        }
        for (let j = 0; j < players[i].scores.length; j++) {
            let score = players[i].scores[j]
            if (
                score <= 0
            ) {
                allScoresValid = false;
            }
        }
    }

    if (allScoresValid && players.length > 0) {
        // Prepare the HTML for the toast notification
        let scoresHtml = '<ul>';
        for (const player of players) {
            const totalScore = document.getElementById(`${player.id}-total`).textContent;
            scoresHtml += `<li>${sanitizeInput(player.name)}: ${totalScore}</li>`;
        }
        scoresHtml += '</ul>';

        // Show the toast notification with innerHTML
        toastr.info(`
            <div>Game finished</div><br>
            <div>Your scores:</div><br>
            ${scoresHtml}
        `, null, { closeButton: true, allowHtml: true });
    } else {
        // show toast for invalid stuff
        if (players.length === 0) {
            toastr.warning("You have no players.");
        } else {
            toastr.warning("Please ensure all scores are filled out with 1 or higher.");
        }
    }
}


document.getElementById("player-add-button").addEventListener("click", addAPlayer);
document.getElementById("options-container").addEventListener("change", checkForCourseChange);
document.getElementById("tee-container").addEventListener("change", checkForTeeChange);
document.getElementById("finish-button").addEventListener("click", checkForFinish);

// create stuff on the page initially
await updateEverything();