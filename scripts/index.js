"use strict";



const mainLink = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json";
const courses = []

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

async function setUpCourseData() {

    const data = await dataFromUrl(mainLink);

    for (const key in data) {
        const url = data[key].url;
        const courseData = await dataFromUrl(url);
        courses.push(courseData);

    }

}

await setUpCourseData();
// code that does the rest of needed things
console.log(courses);

function createCourseSelect() {
    for (const course of courses) {
        const name = `${course.name} (${course.city}, ${course.stateOrProvince})`;
        const container = document.getElementById("options-container");
        
    }
}