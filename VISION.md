# VISION

Marble Blast Web is a clean-room web port of the 3D platformer games Marble Blast Gold and Marble Blast Platinum (including Marble Blast Ultra).

The objective is to roll your marble to the finish pad in the fastest time possible, while avoiding hazards and collecting gems and power-ups.
The game includes almost 4000 levels. It implements all gameplay elements, sounds, music, and UI/menu components from MBG, MBP, and MBU.

The two games (Gold/Platinum) can be switched between seamlessly in the main menu.
Playable via keyboard, mouse, gamepad, or touch on mobile devices.

The game is fully implemented in TypeScript, utilizes its own custom rendering and physics engine (originally used Three.js and OimoPhysics but moved away), and reads/imports assets from .dif, .dts, and .mis files used by the Torque 3D Engine.

**Core Foundational Ideas:**
- Performance and consistency across all modern web browsers (Chromium, Firefox, Safari).
- Identical physics simulation at a fixed 120 Hz rate with continuous collision detection.
- Fast lazy loading.
- High-quality leaderboards and replays.
- Extreme moddability through community custom levels (Marbleland).
