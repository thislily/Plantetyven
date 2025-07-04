// lightswitchAnimation.mjs

/**
 * Plays the lightswitch animation sequence with the bottom arm:
 * - Hides the start button and shows the lightswitch image
 * - Updates instruction text
 * - Slides the bottom arm into view (distance varies by screen size)
 * - Retracts the arm
 * - Fades #game to black, hides plants & controls, shows blinking eyes
 * - Waits BLINK_DURATION + POST_BLINK
 * - Reverts the #game area to normal
 * Resolves a Promise when complete.
 *
 * @param {{
 *   catArmBottom: HTMLElement,
 *   startBtn:     HTMLElement,
 *   lightSwitch:  HTMLElement,
 *   textDisplay:  HTMLElement
 * }} params
 */
export function runLightswitchSequence({
  catArmBottom,
  startBtn,
  lightSwitch,
  textDisplay,
}) {
  return new Promise((resolve) => {
    // 1) Hide Start, show switch, update copy
    startBtn.style.display       = "none";
    lightSwitch.style.display    = "block";
    textDisplay.textContent      = "Husk disse seks plantene!";
    textDisplay.classList.add("bold-text");
    textDisplay.style.fontSize   = "24px";
    textDisplay.style.width      = "230px";

    // 2) Anchor arm off-screen right & hide it
    catArmBottom.style.position  = "absolute";
    catArmBottom.style.right     = "0";
    catArmBottom.style.transform = "translateX(0) scaleX(-1)";
    catArmBottom.style.opacity   = "0";

    // 3) Timing constants
    const SLIDE_DURATION  = 3000; // ms to slide in
    const HOLD_DURATION   = 1000; // ms to pause at switch
    const FADE_DURATION   = 200;  // ms for blackout fade
    const BLINK_DURATION  = 2000; // ms for blink animation
    const POST_BLINK      = 500;  // ms extra pause after blink

    // 4) Slide distances
    const MOBILE_SLIDE_DISTANCE  =  146;  // px on mobile
    const DESKTOP_SLIDE_DISTANCE = 26;  // px on desktop (>=600px)
    function getSlideDistance() {
      return window.matchMedia('(min-width: 600px)').matches
        ? DESKTOP_SLIDE_DISTANCE
        : MOBILE_SLIDE_DISTANCE;
    }

    // 5) Slide arm in
    requestAnimationFrame(() => {
      const dist = getSlideDistance();
      catArmBottom.style.transition = 
        `transform ${SLIDE_DURATION}ms ease, opacity 0.2s ease`;
      catArmBottom.style.transform  = `translateX(${dist}px) scaleX(-1)`;
      catArmBottom.style.opacity    = "1";
    });

    // 6) After slide + hold, retract & blackout
    setTimeout(() => {
      // retract arm 
      catArmBottom.style.transition = `transform ${RETREAT_DURATION}ms ease`;
      catArmBottom.style.transform  = "translateX(0) scaleX(-1)";
      // once retracted, hide instantly
      setTimeout(() => catArmBottom.style.opacity = "0", RETREAT_DURATION);

      // fade #game container to black
      const game = document.getElementById("game");
      game.style.transition       = `background-color ${FADE_DURATION}ms ease`;
      game.style.backgroundColor  = "#000";

      // update text to "Å nei!"
      textDisplay.style.color      = "var(--p-white)";
      textDisplay.textContent      = "Å nei!";
      textDisplay.style.fontSize   = "32px";
      textDisplay.style.marginBottom = "24px";

      // hide plants & controls
      const plantDisplay = game.querySelector(".plant-display");
      const controls     = game.querySelector("#controls");
      if (plantDisplay) plantDisplay.style.opacity = "0";
      if (controls)     controls.style.opacity     = "0";

      // show blinking eyes
      const catEyes = document.querySelector(".cat-eyes");
      if (catEyes) {
        catEyes.style.display = "flex";
        catEyes.style.opacity = "1";
      }

      // 7) After blink + pause, revert screen and resolve
      setTimeout(() => {
        // revert background & show plants
        game.style.backgroundColor = "var(--p-beige)";
        textDisplay.style.color    = "var(--p-black)";
        if (plantDisplay) plantDisplay.style.opacity = "1";

        // hide the eyes
        if (catEyes) catEyes.style.display = "none";

        resolve();
      }, BLINK_DURATION + POST_BLINK);

    }, SLIDE_DURATION + HOLD_DURATION);
  });
}

// note: RETREAT_DURATION must be in scope
const RETREAT_DURATION = 500;
