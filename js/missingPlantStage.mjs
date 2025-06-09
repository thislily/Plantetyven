// missingPlantStage.mjs

/**
 * Initializes the “find the missing plant” selection stage, then shows
 * a win/lose panel and hides the shelves & controls until a restart.
 *
 * @param {object} params
 * @param {NodeListOf<HTMLImageElement>} params.plantEls   – the <img class="plant"> elements currently on screen (6 total)
 * @param {string[]}                    params.allPlantIds – all 8 plant filenames, e.g. ['plant1.webp', …, 'plant8.webp']
 * @param {HTMLElement}                 params.infoSection – the .info-section container where we’ll render the choices
 * @param {HTMLElement}                 params.textDisplay – the #text-display <p> for instructions/feedback
 * @param {HTMLElement}                 params.streakCount – the #streak-count <span> showing the current streak
 */
export function initMissingPlantStage({
  plantEls,
  allPlantIds,
  infoSection,
  textDisplay,
  streakCount,
}) {
  // 1) Clear out any previous UI
  infoSection.innerHTML = "";

  // 2) Collect displayed plant IDs
  const displayedEls = Array.from(plantEls);
  const displayedIds = displayedEls.map((el) => el.dataset.plant);

  if (displayedIds.length < 3) {
    console.error(
      "Need at least 3 displayed plants to start missingPlantStage"
    );
    return;
  }

  // 3) Randomly choose one to “steal”
  const stolenIndex = Math.floor(Math.random() * displayedIds.length);
  const stolenId = displayedIds[stolenIndex];

  // 4) Hide that plant from the shelves
  displayedEls[stolenIndex].style.visibility = "hidden";

  // 5) Decoys are the two plants never displayed
  const decoyIds = allPlantIds.filter((id) => !displayedIds.includes(id));
  // decoyIds should be exactly length 2

  // 6) Build and shuffle the three choices
  const choices = [
    { id: stolenId, correct: true },
    { id: decoyIds[0], correct: false },
    { id: decoyIds[1], correct: false },
  ].sort(() => Math.random() - 0.5);

  // 7) Render the 3-choice selection UI
  const panel = document.createElement("div");
  panel.className = "selection-panel";

  // choices row (images)
  const container = document.createElement("div");
  container.className = "choices";
  panel.appendChild(container);

  // prompt below
  const prompt = document.createElement("p");
  prompt.textContent = "Hvilken mangler?";
  panel.appendChild(prompt);

  choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";

    const img = document.createElement("img");
    img.src = `images/${choice.id}`;
    img.alt = choice.id;
    img.width = 70;
    img.height = 70;
    btn.appendChild(img);

    btn.addEventListener("click", () => {
      // disable further clicks
      container.querySelectorAll("button").forEach((b) => (b.disabled = true));
      // show end‐of‐game panel
      showEndPanel({
        correct: choice.correct,
        plantId: choice.id,
        infoSection,
        textDisplay,
        streakCount,
      });
    });

    container.appendChild(btn);
  });

  infoSection.appendChild(panel);
}

/**
 * Shows the win/lose panel, hides the shelves & controls, and wires up restart/links.
 *
 * @param {object} params
 * @param {boolean} params.correct      – whether the choice was correct
 * @param {string}  params.plantId      – the filename of the stolen plant
 * @param {HTMLElement} params.infoSection
 * @param {HTMLElement} params.textDisplay
 * @param {HTMLElement} params.streakCount
 */
function showEndPanel({
  correct,
  plantId,
  infoSection,
  textDisplay,
  streakCount,
}) {
  // clear out any existing UI
  infoSection.innerHTML = "";
  infoSection.style.display = "flex";
  infoSection.style.flexDirection = "column";
  infoSection.style.alignItems = "center";
  infoSection.style.justifyContent = "center";

  // hide shelves & controls until restart
  const game = document.getElementById("game");
  const plantDisplay = game.querySelector(".plant-display");
  const controls = game.querySelector("#controls");
  if (plantDisplay) plantDisplay.style.display = "none";
  if (controls) controls.style.display = "none";

  // panel container
  const panel = document.createElement("div");
  panel.className = "selection-panel";
  panel.style.height = "360px";
  panel.style.marginBottom = "24px"; // keep your existing bottom margin
  // ← **NEW**: center the panel horizontally
  panel.style.marginLeft = "auto";
  panel.style.marginRight = "auto";

  // header message
  const msg = document.createElement("h2");
  msg.textContent = correct ? "Du klarte det!" : "Nesten!";
  panel.appendChild(msg);

  // plant image
  const img = document.createElement("img");
  img.src = `images/${plantId}`;
  img.alt = plantId;
  img.width = 110;
  img.height = 110;
  panel.appendChild(img);

  // primary button
  const btn = document.createElement("button");
  btn.className = "btn-primary";
  btn.textContent = correct ? "Få rabatt her!" : "Prøv igjen!";
  panel.appendChild(btn);

  // append the panel
  infoSection.appendChild(panel);

  // secondary link
  const link = document.createElement("a");
  link.className = "secondary-link";
  if (correct) {
    link.textContent = "Spill igjen →";
    link.href = "https://plantasjen.no";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.reload();
    });
    // bump streak
    const newStreak = parseInt(streakCount.textContent || "0", 10) + 1;
    streakCount.textContent = newStreak;
    localStorage.setItem("plantStreak", newStreak);
  } else {
    link.textContent = "Besøk nettsiden →";
    link.href = "https://plantasjen.no";
    // reset streak
    streakCount.textContent = "0";
    localStorage.setItem("plantStreak", 0);
  }
  link.style.marginBottom = "48px"; // keep existing bottom margin
  // ← **NEW**: center the link horizontally
  link.style.display = "block";
  link.style.marginLeft = "auto";
  link.style.marginRight = "auto";

  // primary button behavior
  if (correct) {
    btn.addEventListener("click", () => {
      window.location.href = "https://plantasjen.no";
    });
  } else {
    btn.addEventListener("click", () => {
      window.location.reload();
    });
  }

  infoSection.appendChild(link);
}
