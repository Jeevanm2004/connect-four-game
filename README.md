# Connect Four 🎮

A premium, modern web implementation of the classic Connect Four game. Built with HTML, CSS, and Vanilla JavaScript, this project features a highly polished user interface, fluid physics-based animations, and a built-in CPU opponent.

## ✨ Features

- **Two Game Modes**: 
  - **Player vs Player**: Battle it out locally with a friend.
  - **Player vs CPU**: Test your skills against a smart automated opponent.
- **Dynamic Physics Animations**: Discs feature variable drop speeds based on gravity and distance, ending with a satisfying compression bounce.
- **Premium Win Cascade**: When a 4-in-a-row is detected, a dramatic, staggered white-ring cascade highlights the winning path starting directly from the winning piece.
- **Smart UI Polishes**: 
  - Dynamic Top-Marker arrow that tracks mouse movement and matches the active player's color.
  - Sleek, modern card-based menu UI.
  - Score tracking and dynamic label swapping ("YOU" vs "CPU").
  - 30-second turn countdown timer to keep the game moving.

## 🚀 Getting Started

This game runs entirely in the browser without the need for a build step or local development server.

1. Clone or download this repository.
2. Double-click the `index.html` file to open it in any modern web browser.
3. Select your game mode from the Main Menu and start playing!

## 🛠️ Technology Stack

- **HTML5**: Semantic structure and SVG masking for the premium board cutout effect.
- **CSS3**: Extensive use of CSS Variables (Custom Properties) for easy theming, Flexbox/Grid for robust layout management, and `@keyframes` for physics-based drop and bounce animations.
- **Vanilla JavaScript**: Zero dependencies. Features a custom game engine that handles 2D matrix win-detection, CPU logic, DOM manipulation, and precise `setTimeout` animation sequencing.

## 🎨 Design System

The game utilizes a strict color palette defined via CSS variables for easy customization:
- **Background**: Deep Purple (`#7945FF`)
- **Player 1 (Red)**: Vibrant Pink (`#FD6687`)
- **Player 2 (Yellow)**: Bright Yellow (`#FFCE67`)
- **Board**: Crisp White (`#FFFFFF`) with heavy black borders for a tactile, "blocky" premium feel.

## 🤝 Contributing

Feel free to fork this project and submit pull requests. Potential areas for expansion:
- Adding a Minimax algorithm for an "Expert" CPU difficulty.
- Adding sound effects for piece drops and victory fanfare.
- Creating an online multiplayer mode using WebSockets.

---
*Developed as a demonstration of modern frontend styling, DOM manipulation, and game logic architecture.*
