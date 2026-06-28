# IDEAS FOR IMPROVEMENT

- Add multiplayer/online ghost racing to allow players to race against others' replays in real-time.
- Introduce a level editor within the browser, utilizing an intuitive drag-and-drop UI to place Torque 3D objects, configure interiors, and set up triggers.
- Port or emulate older torque versions to allow direct playing of levels from older games like Marble Blast Advanced or even porting to torque's TGEA for Marble Blast Ultra.
- Add full modding support including downloading texture packs directly from Marbleland.
- Add WebRTC for real-time multiplayer.
- Overhaul gamepad support by allowing fully customizable axes and buttons bindings, including support for analog triggers mapped to specific actions and deadzone sliders.
- Add support for custom shapes (.dts) parsing and rendering in-browser, to allow full custom shape modding without a server-side build step.

## Framework Migration Proposal: Svelte for UI/UX
The current codebase heavily relies on raw DOM manipulation (`document.createElement`, `appendChild`) for its UI components, especially in complex views like `options_mbg.ts`, `options_mbp.ts`, and the new Level Editor overlay (`editor.ts`). This creates significant technical debt, making state synchronization and reactive rendering cumbersome (e.g., manually maintaining `this.updateFuncs` arrays to refresh UI elements).

**Recommendation:** Progressively migrate the UI overlays to a lightweight framework like **Svelte**.
- **Why Svelte?** It compiles away to minimal vanilla JS, meaning it won't bloat the bundle size or interfere with the high-performance 120Hz physics tick and Three.js rendering loops.
- **Benefits:** Two-way data binding for `StorageManager.data.settings`, component-based architecture for modal dialogs (like the Level Editor layout and Gamepad rebind modal), and scoped CSS.


## Framework Migration Proposal: Svelte for UI/UX
The current codebase heavily relies on raw DOM manipulation (`document.createElement`, `appendChild`) for its UI components, especially in complex views like `options_mbg.ts`, `options_mbp.ts`, and the new Level Editor overlay (`editor.ts`). This creates significant technical debt, making state synchronization and reactive rendering cumbersome (e.g., manually maintaining `this.updateFuncs` arrays to refresh UI elements).

**Recommendation:** Progressively migrate the UI overlays to a lightweight framework like **Svelte**.
- **Why Svelte?** It compiles away to minimal vanilla JS, meaning it won't bloat the bundle size or interfere with the high-performance 120Hz physics tick and Three.js rendering loops.
- **Benefits:** Two-way data binding for `StorageManager.data.settings`, component-based architecture for modal dialogs (like the Level Editor layout and Gamepad rebind modal), and scoped CSS.
