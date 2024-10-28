"use strict";

import {
    // variables
    players
} from "./globalVars.js";

import {
    // function
    createTable
} from "./table.js";

export class Player {
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

export function addAPlayer() {
    if (players.length < 4) {
        const player = new Player("Click/Tap to name player");
        players.push(player);
        createTable();
    }
}