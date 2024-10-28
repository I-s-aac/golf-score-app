"use strict";

import {
    dataFromUrl
} from "./utils.js";

export const coursesPartialLink = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course"; // add "${courseId}.json" to the end
const mainLink = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json";
export const courses = await dataFromUrl(mainLink);
export const players = [];
export const courseData = {
    "currentCourse": null,
    "currentTee": null,
    "currentHole": 0
}