// Example data structure to simulate fetched courses (you can replace this with an actual API call)
const courses = [
    { id: 11819, name: "Thanksgiving Point Golf Course" },
    { id: 18300, name: "Fox Hollow Golf Course" },
    { id: 19002, name: "Spanish Oaks Golf Course" }
];

// Define the number of holes
const numberOfHoles = 18; // You can change this to whatever number you need

// Function to create the header
function createHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <h1 class="text-center">Golf Scorecard App</h1>
        <h3 class="text-center">Select Your Course and Tee</h3>
    `;
}

// Function to populate the options container with course and tee selections
function createOptions() {
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = `
        <div class="form-group">
            <label for="course-select">Select Course</label>
            <select class="form-control" id="course-select"></select>
        </div>
        <div class="form-group">
            <label for="tee-box-select">Select Tee</label>
            <select class="form-control" id="tee-box-select">
                <option value="0">Men's Tees</option>
                <option value="1">Women's Tees</option>
                <option value="2">Senior Tees</option>
            </select>
        </div>
        <div class="form-group">
            <button class="btn btn-primary" onclick="addPlayer()">Add Player</button>
        </div>
    `;

    // Populate the course dropdown
    const courseSelect = document.getElementById('course-select');
    courses.forEach(course => {
        courseSelect.innerHTML += `<option value="${course.id}">${course.name}</option>`;
    });
}

// Function to create the scorecard table structure dynamically based on the number of holes
function createScorecard() {
    const scorecard = document.getElementById('scorecard');
    const scorecardTable = `
        <h4 class="text-center">Scorecard</h4>
        <div class="table-responsive">
            <table class="table table-bordered" id="scorecard-table">
                <thead>
                    <tr>
                        <th>Player Name</th>
                        ${generateHoleHeaders()}
                        <th>In</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody id="scorecard-body">
                    <!-- Player rows will be dynamically generated here -->
                </tbody>
            </table>
        </div>
    `;
    scorecard.innerHTML += scorecardTable;
}

// Function to generate the hole headers dynamically based on the number of holes
function generateHoleHeaders() {
    let headers = '';
    for (let i = 1; i <= numberOfHoles; i++) {
        headers += `<th>Hole ${i}</th>`;
    }
    return headers;
}

// Function to add a new player row to the scorecard
function addPlayerToScorecard(playerName) {
    const scorecardBody = document.getElementById('scorecard-body');
    const newRow = `
        <tr>
            <td>${playerName}</td>
            ${generateHoleInputs()}
            <td><input type="text" class="form-control" readonly></td>
            <td><input type="text" class="form-control" readonly></td>
        </tr>
    `;
    scorecardBody.innerHTML += newRow;
}

// Function to generate input fields for each hole dynamically
function generateHoleInputs() {
    let inputs = '';
    for (let i = 1; i <= numberOfHoles; i++) {
        inputs += `<td><input type="number" class="form-control" placeholder="0"></td>`;
    }
    return inputs;
}

// Function to add a player (you can modify this to get the name from an input)
function addPlayer() {
    const playerName = prompt("Enter player's name:");
    if (playerName) {
        addPlayerToScorecard(playerName);
    }
}

// Call the functions on page load
window.onload = function () {
    createHeader();
    createOptions();
    createScorecard();
};

// Example: Add an initial player to the scorecard for demonstration
addPlayerToScorecard("Player 1");
