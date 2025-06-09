// plantRenderer.mjs

/**
 * Takes 8 plant filenames, shuffles them, and injects
 * the first 3 into #plants-top (after the cat-arm-top)
 * and the next 3 into #plants-bottom (before the cat-arm-bottom).
 * Implements real lazy‐loading via IntersectionObserver.
 *
 * @param {string[]} allPlants — e.g. ['plant1.webp', …, 'plant8.webp']
 * @param {HTMLElement} topContainer
 * @param {HTMLElement} bottomContainer
 */
export function renderPlantRows(allPlants, topContainer, bottomContainer) {
  // 1) Shuffle and take 6
  const shuffled      = [...allPlants].sort(() => Math.random() - 0.5);
  const selection     = shuffled.slice(0, 6);
  const topPlants     = selection.slice(0, 3);
  const bottomPlants  = selection.slice(3, 6);

  // 2) Clear out any old plants (but keep the cat-arm)
  [topContainer, bottomContainer].forEach(container => {
    Array.from(container.children).forEach(child => {
      if (!child.id?.startsWith('cat-arm')) {
        container.removeChild(child);
      }
    });
  });

  // 3) Setup an IntersectionObserver to load images when they appear
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src    = img.dataset.src;
        obs.unobserve(img);
      }
    });
  }, {
    root: null,           // viewport
    rootMargin: '0px',
    threshold: 0.1        // trigger when 10% visible
  });

  // 4) Helper to create a lazy‐loaded <img>
  function makePlantImg(filename) {
    const img = document.createElement('img');
    img.alt           = `Plant ${filename.match(/\d+/)[0]}`;
    img.className     = 'plant';
    img.dataset.plant = filename;
    img.dataset.src   = `images/${filename}`;  // hold real URL in data-src

    // async decode once it loads
    img.decoding      = 'async';

    // start observing — src will only be set when it scrolls into view
    io.observe(img);
    return img;
  }

  // 5) Insert top row
  topPlants.forEach(name => {
    const img = makePlantImg(name);
    topContainer.appendChild(img);
  });

  // 6) Insert bottom row before the bottom arm
  const bottomArm = bottomContainer.querySelector('#cat-arm-bottom');
  bottomPlants.forEach(name => {
    const img = makePlantImg(name);
    bottomContainer.insertBefore(img, bottomArm);
  });
}
