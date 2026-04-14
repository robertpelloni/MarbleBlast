### Architecture & Patterns
- **Language**: The project is written in strictly-typed **TypeScript** and relies on **Rollup** for bundling the frontend client code (`src/js/bundle.js`) and the backend server code (`server/bundle.js`).
- **Engines**: The game utilizes a **custom physics and rendering engine**. Previous iterations used Three.js and OimoPhysics, but the project shifted away from them. The physics engine simulates at a fixed rate of **120 Hz** using continuous collision detection for ultra-accurate marble movement and collisions.
- **Assets**: Map files, shapes, and 3D data are read natively from original Torque 3D file formats (e.g., `.dif`, `.dts`, `.mis`). A custom parser converts this legacy binary data into the custom engine's representation in the browser.
- **Rendering**: The project heavily utilizes the WebCodecs API and a custom WebM multiplexer for the internal video rendering features.
- **UI System**: The menus (Level Select, Help, Options, HUD) are crafted strictly via custom plain HTML/CSS over a single `index.html` structure (`src/index.html`). Interaction logic is tightly coupled into individual TS files per view (e.g., `options_mbp.ts`).
- **Data Persistence**: Uses the `StorageManager` to interface cleanly with both `localStorage` and `IndexedDB`. Settings like controls, mouse sensitivities, graphic flags are serialized, loaded into the object tree upon init, and then synced asynchronously back to local storage upon mutation.
- **Inputs**: Extensive controller support exists in `src/ts/input.ts`. It maps keyboard, mouse, touch joysticks, and the Gamepad API efficiently into a global state payload.

### Decisions & Discoveries
- **Two Games in One**: The user can flawlessly switch between Marble Blast Gold (MBG) and Marble Blast Platinum (MBP) in the UI. Many scripts export sibling logic classes to handle differences in UI presentation (e.g., `options_mbg.ts` and `options_mbp.ts`).
- **Feature Roadmap & To-Do**:
  - Configurable gamepad arrays have been migrated from hardcoded defaults in `input.ts` into `StorageManager.data.settings`.
  - GUI elements for mapping these buttons are heavily reliant on extensive markup within `index.html`. Thus, they remain an open item in `TODO.md`.
  - Multi-player "ghost racing," a level editor ported into the browser natively, and deeper support for `TGEA` assets (Ultra version items) form the crux of `IDEAS.md`.
- **Build Steps**: I've recognized that updating frontend UI or settings schemas requires manually bundling through Rollup, which pushes files into the `assets` mapping folder using `Sarcina` (the chosen build utility).

Is there any specific portion of the roadmap or features that you'd like me to continue with, or would you like me to mark this task as completed?