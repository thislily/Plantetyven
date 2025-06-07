// startingLoop.mjs
/**
 * Simplified looping animation for top row only:
 * - Arm pops out EXTEND_DISTANCE px from left edge
 * - Middle top plant wiggles
 * - Arm retreats fully hidden
 */
const EXTEND_DISTANCE   = 110;  // px
const REACH_DURATION    = 400;  // ms
const WIGGLE_DURATION   = 700;  // ms
const PAUSE_AFTER_WIGGLE= 200;  // ms
const RETREAT_DURATION  = 500;  // ms
const LOOP_PAUSE        = 800;  // ms

function animateTopArm(arm) {
  // Anchor hidden off-screen on left
  arm.style.position  = 'absolute';
  arm.style.left      = '0';
  arm.style.right     = '';
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

  // 2) Wiggle first top plant
  setTimeout(() => {
    const plant = document.querySelector('#plants-top .plant:nth-child(2)');
    plant.classList.add('plant-wiggle');
    setTimeout(() => {
      plant.classList.remove('plant-wiggle');
    }, WIGGLE_DURATION);
  }, REACH_DURATION);

  // 3) Retreat off-screen
  setTimeout(() => {
    arm.style.transition = `transform ${RETREAT_DURATION}ms ease, opacity 0.2s`;
    arm.style.transform  = hideTransform;
    arm.style.opacity    = '0';
  }, REACH_DURATION + WIGGLE_DURATION + PAUSE_AFTER_WIGGLE);
}

export function startingLoop(catArmTop) {
  function loop() {
    animateTopArm(catArmTop);
    setTimeout(loop,
      REACH_DURATION + WIGGLE_DURATION + PAUSE_AFTER_WIGGLE + RETREAT_DURATION + LOOP_PAUSE
    );
  }
  loop();
}
