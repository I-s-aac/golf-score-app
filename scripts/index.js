"use strict";



const mainLink = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/courses.json";
const coursesPartialLink = "https://exquisite-pastelito-9d4dd1.netlify.app/golfapi/course"; // add "${courseId}.json" to the end
const courses = await dataFromUrl(mainLink);


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
    const data = await dataFromUrl(coursesPartialLink + `${selectedCourseId}.json`);

    let newHtml = "";
    console.log(data);
    newHtml += `
    
    `;
}
await createTeeSelect();