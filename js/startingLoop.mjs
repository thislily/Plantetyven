// startingLoop.mjs

/**
 * Simplified looping animation for top row only:
 * - Arm pops out EXTEND_DISTANCE px from left edge
 * - Middle top plant wiggles (if present)
 * - Arm retreats fully hidden
 * Exposes stopLoop() to end the loop.
 */
const EXTEND_DISTANCE    = 110;
const REACH_DURATION     = 400;
const WIGGLE_DURATION    = 700;
const PAUSE_AFTER_WIGGLE = 200;
const RETREAT_DURATION   = 500;
const LOOP_PAUSE         = 800;

let running   = false;
let timeoutId = null;

function animateTopArm(arm) {
  // position and hide
  arm.style.position  = 'absolute';
  arm.style.left      = '0';
  arm.style.transform = 'translateX(-100%)';
  arm.style.opacity   = '0';

  const hideTransform = 'translateX(-100%)';
  const showTransform = `translateX(calc(-100% + ${EXTEND_DISTANCE}px))`;

  // 1) Pop out
  requestAnimationFrame(() => {
    arm.style.transition = `transform ${REACH_DURATION}ms ease, opacity 0.2s`;
    arm.style.transform  = showTransform;
    arm.style.opacity    = '1';
  });

  // 2) Wiggle the middle plant, if it exists
  setTimeout(() => {
    const plant = document.querySelector('#plants-top .plant:nth-child(2)');
    if (plant) {
      plant.classList.add('plant-wiggle');
      setTimeout(() => {
        plant.classList.remove('plant-wiggle');
      }, WIGGLE_DURATION);
    }
  }, REACH_DURATION);

  // 3) Retreat
  setTimeout(() => {
    arm.style.transition = `transform ${RETREAT_DURATION}ms ease, opacity 0.2s`;
    arm.style.transform  = hideTransform;
    arm.style.opacity    = '0';
  }, REACH_DURATION + WIGGLE_DURATION + PAUSE_AFTER_WIGGLE);
}

export function startingLoop(catArmTop) {
  running = true;
  function loop() {
    if (!running) return;
    animateTopArm(catArmTop);
    timeoutId = setTimeout(
      loop,
      REACH_DURATION +
      WIGGLE_DURATION +
      PAUSE_AFTER_WIGGLE +
      RETREAT_DURATION +
      LOOP_PAUSE
    );
  }
  loop();
}

export function stopLoop() {
  running = false;
  if (timeoutId) clearTimeout(timeoutId);
}
