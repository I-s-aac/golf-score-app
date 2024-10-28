"use strict";

import {
    // variables
    courses,
    courseData,
    coursesPartialLink
} from "./globalVars.js";

import {
    // functions
    dataFromUrl
} from "./utils.js";

export function createCourseSelect() {
    let newHtml = "";

    for (const course of courses) {
        newHtml += `<option value="${course.id}">${course.name}</option>`;
    }

    document.getElementById("options-container").innerHTML = newHtml;
}

export async function createTeeSelect() {
    const selectedCourseId = document.getElementById("options-container").value;
    courseData.currentCourse = await dataFromUrl(coursesPartialLink + `${selectedCourseId}.json`);

    let newHtml = "";

    for (const tee of courseData.currentCourse.holes[courseData.currentHole].teeBoxes) {
        const description = tee.teeType.slice(0, 1).toUpperCase() + tee.teeType.slice(1).toLowerCase();;

        newHtml += `
            <option value="${tee.teeType}">${description}</option>
        `;
    }

    document.getElementById("tee-container").innerHTML = newHtml;
    courseData.currentTee = document.getElementById("tee-container").value;
}