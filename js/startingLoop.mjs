// startingLoop.mjs

/**
 * Simplified looping animation for top row only:
 * - Arm pops out a distance that’s larger on desktop
 * - Middle top plant wiggles (if present)
 * - Arm retreats fully hidden without fading
 * Exposes stopLoop() to end the loop.
 */

const MOBILE_EXTEND_DISTANCE  = 110;  // px on mobile
const DESKTOP_EXTEND_DISTANCE = 220;  // px on desktop (>=600px)

const REACH_DURATION     = 400;   // ms
const WIGGLE_DURATION    = 700;   // ms
const PAUSE_AFTER_WIGGLE = 200;   // ms
const RETREAT_DURATION   = 500;   // ms
const LOOP_PAUSE         = 800;   // ms between loops

let running   = false;
let timeoutId = null;

/**
 * Chooses the right extend distance based on viewport width.
 */
function getExtendDistance() {
  return window.matchMedia('(min-width: 600px)').matches
    ? DESKTOP_EXTEND_DISTANCE
    : MOBILE_EXTEND_DISTANCE;
}

function animateTopArm(arm) {
  // 1) Position & hide off-screen to left
  arm.style.position  = 'absolute';
  arm.style.left      = '0';
  arm.style.transform = 'translateX(-100%)';
  arm.style.opacity   = '0';

  const distance      = getExtendDistance();
  const hideTransform = 'translateX(-100%)';
  const showTransform = `translateX(calc(-100% + ${distance}px))`;

  // 2) Pop out with fade-in
  requestAnimationFrame(() => {
    arm.style.transition = `transform ${REACH_DURATION}ms ease, opacity 0.2s`;
    arm.style.transform  = showTransform;
    arm.style.opacity    = '1';
  });

  // 3) Wiggle middle plant (if present)
  setTimeout(() => {
    const plant = document.querySelector('#plants-top .plant:nth-child(2)');
    if (plant) {
      plant.classList.add('plant-wiggle');
      setTimeout(() => plant.classList.remove('plant-wiggle'), WIGGLE_DURATION);
    }
  }, REACH_DURATION);

  // 4) Retreat without fading
  setTimeout(() => {
    // animate transform only
    arm.style.transition = `transform ${RETREAT_DURATION}ms ease`;
    arm.style.transform  = hideTransform;

    // once the retreat is done, snap opacity to 0
    setTimeout(() => {
      arm.style.transition = '';   // clear transition
      arm.style.opacity    = '0';  // instant hide
    }, RETREAT_DURATION);

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
