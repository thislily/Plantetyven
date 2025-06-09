// plantRenderer.mjs
/**
 * Takes 8 plant filenames, shuffles them, and injects
 * the first 3 into #plants-top (after the cat-arm-top)
 * and the next 3 into #plants-bottom (before the cat-arm-bottom).
 *
 * @param {string[]} allPlants — e.g. ['plant1.webp', …, 'plant8.webp']
 * @param {HTMLElement} topContainer
 * @param {HTMLElement} bottomContainer
 */
export function renderPlantRows(allPlants, topContainer, bottomContainer) {
  // 1) Shuffle and take 6
  const shuffled = [...allPlants].sort(() => Math.random() - 0.5);
  const selection = shuffled.slice(0, 6);
  const topPlants    = selection.slice(0, 3);
  const bottomPlants = selection.slice(3, 6);

  // 2) Clear out any old plants (but keep the cat-arm)
  //    We'll remove all children *except* the one whose id starts with 'cat-arm'
  [topContainer, bottomContainer].forEach(container => {
    Array.from(container.children).forEach(child => {
      if (!child.id?.startsWith('cat-arm')) {
        container.removeChild(child);
      }
    });
  });

  // 3) Helper to create an <img class="plant">
  function makePlantImg(filename) {
    const img = document.createElement('img');
    img.src       = `images/${filename}`;
    img.alt       = `Plant ${filename.match(/\d+/)[0]}`;
    img.className = 'plant';
    img.dataset.plant = filename; // stash for later
    return img;
  }

  // 4) Insert top row (after the arm)
  topPlants.forEach(name => {
    const img = makePlantImg(name);
    topContainer.appendChild(img);
  });

  // 5) Insert bottom row (before the bottom arm)
  //    Find the arm node and insert plants before it
  const bottomArm = bottomContainer.querySelector('#cat-arm-bottom');
  bottomPlants.forEach(name => {
    const img = makePlantImg(name);
    bottomContainer.insertBefore(img, bottomArm);
  });
}
