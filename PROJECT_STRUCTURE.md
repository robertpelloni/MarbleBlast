# PROJECT STRUCTURE AND LIBRARIES

## Directory Layout
- `/src`: Contains the primary TypeScript codebase for the web client.
  - `/src/ts/ui`: All HTML/CSS interaction logic, menus, dialogs.
  - `/src/ts/physics`: Custom physics engine and logic for continuous collision detection.
  - `/src/ts/rendering`: All logic required to interface with WebCodecs, load WebGL, render `.dts` and `.dif` Torque assets.
- `/server`: Node.js backend. Serves custom levels and leaderboards using `better-sqlite3`.
- `/assets`: Extracted Torque engine assets (sounds, images, maps) mapped dynamically via `Sarcina`.
- `/docs`: Markdown documentation.

## Submodules
There are **no git submodules** present in this project currently. It primarily relies on NPM packages for its tooling.

## Key Libraries (NPM)
- **`rollup`** (2.0.0): Used exclusively for compiling the large TypeScript codebase into unified frontend and backend scripts efficiently.
- **`jszip`** (^3.6.0): Handles dynamic extraction and parsing of `.zip` level formats in the browser (e.g., custom maps from Marbleland).
- **`better-sqlite3`** (^11.9.1): The backend database adapter for storing and querying leaderboard records at extreme speed.
- **`sarcina`** (^1.7.6): A proprietary build tool created by the original dev to bundle all assets, html, and output files cleanly into the `/dist` deployment folder.
