// missingPlantStage.mjs

/**
 * Initializes the “find the missing plant” selection stage.
 *
 * - Randomly removes one of the displayed plant elements
 * - Presents that missing plant alongside the two plants that were not shown as decoys
 * - Handles the player’s selection, displays win/lose feedback, and updates the streak
 *
 * @param {object} params
 * @param {NodeListOf<HTMLImageElement>} params.plantEls   – the <img class="plant"> elements currently on screen (6 total)
 * @param {string[]}                  params.allPlantIds – all 8 plant filenames, e.g. ['plant1.webp', …, 'plant8.webp']
 * @param {HTMLElement}               params.infoSection – the .info-section container where we’ll render the choices
 * @param {HTMLElement}               params.textDisplay – the #text-display <p> for instructions/feedback
 * @param {HTMLElement}               params.streakCount – the #streak-count <span> showing the current streak
 */
export function initMissingPlantStage({
  plantEls,
  allPlantIds,
  infoSection,
  textDisplay,
  streakCount
}) {
  // 1) Clear out previous controls/text
  infoSection.innerHTML = '';

  // 2) Gather the displayed plant IDs
  const displayedEls = Array.from(plantEls);
  const displayedIds = displayedEls.map(el => el.dataset.plant);

  if (displayedIds.length < 3) {
    console.error('Need at least 3 displayed plants to start missingPlantStage');
    return;
  }

  // 3) Pick one at random to “steal”
  const stolenIndex = Math.floor(Math.random() * displayedIds.length);
  const stolenId    = displayedIds[stolenIndex];

  // 4) Hide that plant from the shelves
  displayedEls[stolenIndex].style.visibility = 'hidden';

  // 5) Compute the two decoy IDs as the plants never displayed
  const decoyIds = allPlantIds.filter(id => !displayedIds.includes(id));
  // decoyIds should be length 2

  // 6) Build the choices array and shuffle it
  const choices = [
    { id: stolenId,  correct: true  },
    { id: decoyIds[0], correct: false },
    { id: decoyIds[1], correct: false }
  ].sort(() => Math.random() - 0.5);

  // 7) Create the selection panel
  const panel = document.createElement('div');
  panel.className = 'selection-panel';

  // First append the choices container (images)
  const container = document.createElement('div');
  container.className = 'choices';
  panel.appendChild(container);

  // Then append the prompt text below
  const prompt = document.createElement('p');
  prompt.textContent = 'Hvilken mangler?';
  panel.appendChild(prompt);

  // 8) For each choice, create a button with the plant image
  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'choice';

    const img = document.createElement('img');
    img.src        = `images/${choice.id}`;
    img.alt        = choice.id;
    img.width      = 70;
    img.height     = 70;
    btn.appendChild(img);

    btn.addEventListener('click', () => {
      // disable further selections
      container.querySelectorAll('button').forEach(b => b.disabled = true);

      if (choice.correct) {
        textDisplay.textContent = 'Gratulerer!';
        // increment streak
        const newStreak = parseInt(streakCount.textContent || '0', 10) + 1;
        streakCount.textContent = newStreak;
        localStorage.setItem('plantStreak', newStreak);
      } else {
        textDisplay.textContent = 'Å nei, feil!';
        // reset streak
        streakCount.textContent = '0';
        localStorage.setItem('plantStreak', 0);
      }
    });

    container.appendChild(btn);
  });

  // 9) Append the panel into the infoSection
  infoSection.appendChild(panel);
}
