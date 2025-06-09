// lightswitchAnimation.mjs

/**
 * Plays the lightswitch animation sequence with the bottom arm:
 * - Hides the start button and shows the lightswitch image
 * - Updates instruction text
 * - Slides the bottom arm into view over SLIDE_DURATION
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
  textDisplay
}) {
  return new Promise(resolve => {
    // 1) Hide Start, show switch, update copy
    startBtn.style.display    = 'none';
    lightSwitch.style.display = 'block';
    textDisplay.textContent   = 'Hjelp oss å finne den stjålne planten';
    textDisplay.style.width = '230px'

    // 2) Anchor arm off-screen right & hide
    catArmBottom.style.position  = 'absolute';
    catArmBottom.style.right     = '0';
    catArmBottom.style.transform = 'translateX(0) scaleX(-1)';
    catArmBottom.style.opacity   = '0';

    // 3) Timing constants (shortened)
    const SLIDE_DURATION  = 3000; // ms to slide in (unchanged)
    const HOLD_DURATION   = 1000; // ms to pause at the switch (unchanged)
    const FADE_DURATION   = 200;  // ms for blackout fade (unchanged)
    const BLINK_DURATION  = 2000; // ms for blink animation (was 4000)
    const POST_BLINK      = 500;  // ms extra pause after blink (was 1000)

    // 4) Slide arm in
    requestAnimationFrame(() => {
      catArmBottom.style.transition =
        `transform ${SLIDE_DURATION}ms ease, opacity 0.2s ease`;
      catArmBottom.style.transform  = 'translateX(80px) scaleX(-1)';
      catArmBottom.style.opacity    = '1';
    });

    // 5) After slide + hold, retract & blackout
    setTimeout(() => {
      // retract arm
      catArmBottom.style.transform = 'translateX(0) scaleX(-1)';
      catArmBottom.style.opacity   = '0';

      // fade #game container to black
      const game = document.getElementById('game');
      game.style.transition      = `background-color ${FADE_DURATION}ms ease`;
      game.style.backgroundColor = '#000';
      textDisplay.style.color = 'var(--p-white)';
      textDisplay.textContent = 'Å nei!';
      textDisplay.style.marginBottom = '24px'
      // hide plants & controls
      const plantDisplay = game.querySelector('.plant-display');
      const controls     = game.querySelector('#controls');
      if (plantDisplay) plantDisplay.style.opacity = '0';
      if (controls)     controls.style.opacity     = '0';

      // show blinking eyes
      const catEyes = document.querySelector('.cat-eyes');
      if (catEyes) {
        catEyes.style.display = 'flex';
        catEyes.style.opacity = '1';
      }

      // 6) After blink + shortened pause, revert screen and resolve
      setTimeout(() => {
        // revert background & show plants
        game.style.backgroundColor = 'var(--p-beige)';
        textDisplay.style.color = 'var(--p-black)'; // revert text color
        if (plantDisplay) plantDisplay.style.opacity = '1';

        // hide the eyes
        if (catEyes) catEyes.style.display = 'none';

        resolve();
      }, BLINK_DURATION + POST_BLINK);

    }, SLIDE_DURATION + HOLD_DURATION);
  });
}
