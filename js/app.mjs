// app.mjs

/**
 * Main application entry point for the Plantetyven game.
 * Initializes the game, sets up event listeners, and manages the game flow.
 * @module app
 * 
 * This file handles:
 * - Initializing the game UI
 * - Starting the intro peek loop
 * - Handling the start button click to begin the game
 * - Rendering plant rows
 * - Running the lightswitch animation sequence
 * - Managing the plant streak and missing plant stage
 * 
 */

import { startingLoop, stopLoop } from "./startingLoop.mjs";
import { runLightswitchSequence } from "./lightswitchAnimation.mjs";
import { renderPlantRows } from "./plantRenderer.mjs";
import { initMissingPlantStage } from "./missingPlantStage.mjs";

// all 8 plant image filenames
const ALL_PLANTS = [
  "plant1.webp",
  "plant2.webp",
  "plant3.webp",
  "plant4.webp",
  "plant5.webp",
  "plant6.webp",
  "plant7.webp",
  "plant8.webp",
];

document.addEventListener("DOMContentLoaded", () => {
  // ----- grab DOM elements -----
  const catArmTop = document.getElementById("cat-arm-top");
  const catArmBottom = document.getElementById("cat-arm-bottom");
  const startBtn = document.getElementById("start");
  const lightSwitch = document.getElementById("lightswitch");
  const textDisplay = document.getElementById("text-display");
  const streakCount = document.getElementById("streak-count");
  const infoSection = document.querySelector(".info-section");
  const topShelf = document.getElementById("plants-top");
  const bottomShelf = document.getElementById("plants-bottom");

  // ----- restore saved streak -----
  const savedStreak = localStorage.getItem("plantStreak");
  if (savedStreak !== null) {
    streakCount.textContent = savedStreak;
  }

  +(
    // ----- initial plant render for intro -----
    (+renderPlantRows(ALL_PLANTS, topShelf, bottomShelf))
  );

  // ----- start the intro loop -----
  startingLoop(catArmTop);

  // ----- when the user clicks Start -----
  startBtn.addEventListener("click", async () => {
    // 1) stop the intro peek loop
    stopLoop();

    // 2) reshuffle the plants
    renderPlantRows(ALL_PLANTS, topShelf, bottomShelf);

    // 3) play the lightswitch grab + blackout animation
    await runLightswitchSequence({
      catArmBottom,
      startBtn,
      lightSwitch,
      textDisplay,
    });

    const allEls = document.querySelectorAll(
      "#plants-top .plant, #plants-bottom .plant"
    );
    initMissingPlantStage({
      plantEls: allEls,
      allPlantIds: ALL_PLANTS,
      infoSection,
      textDisplay,
      streakCount,
    });
  });
});
