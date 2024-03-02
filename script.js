"use strict";

window.addEventListener("load", start);

// Controller

function start() {
  console.log("JavaScript kører");
  createBoard();
  let model = createModel(); // Call createModel and store the result in a local variable
  setInterval(function () {
    model = updateGame(model);
    updateView(model);
  }, 1500);
}

function updateGame(model) {
  const newModel = []; // Create a new model to hold the updated state
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      const neighbors = countNeighbors(model, row, col); // Pass model to countNeighbors
      if (model[row][col] === 1) {
        // Cell is alive
        if (neighbors < 2 || neighbors > 3) {
          newRow[col] = 0; // Cell dies
        } else {
          // Any live cell with two or three live neighbors lives on to the next generation.
          newRow[col] = 1; // Cell survives
        }
      } else {
        // Cell is dead
        if (neighbors === 3) {
          // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
          newRow[col] = 1; // Cell becomes alive
        } else {
          newRow[col] = 0; // Cell remains dead
        }
      }
    }
    newModel.push(newRow);
  }
  return newModel; // Return the updated model
}

function countNeighbors(model, row, col) {
  let count = 0;
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (
        i >= 0 &&
        i < GRID_HEIGHT &&
        j >= 0 &&
        j < GRID_WIDTH &&
        !(i === row && j === col)
      ) {
        count += model[i][j];
      }
    }
  }
  return count;
}

// Model

const GRID_WIDTH = 60; // row
const GRID_HEIGHT = 35; // col

function createModel() {
  const model = [];
  for (let row = 0; row < GRID_HEIGHT; row++) {
    const newRow = [];
    for (let col = 0; col < GRID_WIDTH; col++) {
      newRow[col] = Math.random() > 0.5 ? 1 : 0; // Initialize cells randomly as alive or dead
    }
    model.push(newRow);
  }
  return model; // Return the created model
}

// View

function createBoard() {
  const board = document.querySelector("#board");
  board.style.setProperty("--GRID_WIDTH", GRID_WIDTH);

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      board.appendChild(cell);
    }
  }
}

function updateView(model) {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / GRID_WIDTH);
    const col = index % GRID_WIDTH;
    if (model[row][col] === 1) {
      cell.classList.add("alive");
    } else {
      cell.classList.remove("alive");
    }
  });
}
