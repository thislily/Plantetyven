// app.mjs
import { startingLoop } from './startingLoop.mjs';

document.addEventListener('DOMContentLoaded', () => {
  const catArmTop = document.getElementById('cat-arm-top');
  startingLoop(catArmTop);
});