# Plantetyven (Kim’s Game)

A lightweight, vanilla-JS interpretation of “What’s Missing” (Kim’s Game). Memorize six plants, one disappears, then choose which one is missing. Built with modular ES modules, CSS, and no external libraries.

---

## 🚀 Features

- **Intro Loop**: Cat arm peeks and wiggles a plant in continuous animation.
- **Random Plants**: Six plants are chosen at random from a set of eight.
- **Light Switch Animation**: Cat arm flips a switch, screen goes dark, cat blinks.
- **What’s Missing?**: One plant is missing; you pick from three options (the missing plant + two not shown before decoys).
- **Win/Lose Panel**: Feedback messages, streak counter stored in `localStorage`, and links to retry or get a discount.
- **Responsive**: Mobile-first design; desktop extends arm reach and shelf length.

---

## 🌐 Live Demo & Design

- **Live Site**: https://plantetyven.netlify.app/
- **Figma Prototype**: https://www.figma.com/design/BJ3g8BDxBIDlMzFX4M09UE/Untitled?node-id=4-2&t=JjUzTMLq8NSUQ0Wd-1

![App Screenshot](images/screenshot.png)


---

## ⚙️ Installation & Usage

1. **Clone** this repository:
   ```bash
   git clone https://github.com/thislily/plantetyven.git
   cd plantetyven
   ```
2. **Serve** the directory with Live Server or any static host:
   ```bash
   npx serve .
   ```
3. **Open** your browser at `http://localhost:5000` (or the port shown).

---

## 📝 How It Works

1. **On page load**: Six random plants render; the intro arm loop begins.
2. **Press Start**: Intro loop stops; plants reshuffle; light switch animation runs.
3. **Blackout & Blink**: Screen goes dark; cat blinks.
4. **Selection**: Screen restores; one plant is missing; choose which one.
5. **Outcome**: Win/lose panel appears with option to retry or get a discount.

---

## 📄 Author

**Lily Watson**  
[lilywatson.dev@gmail.com](mailto:lilywatson.dev@gmail.com)  
[GitHub: thislily](https://github.com/thislily)


