# HANDOFF

## Current Status
- Read and explored the codebase (`src/ts/ui` and `src/ts/input.ts`).
- Created deep documentation for the repository: `AGENTS.md`, `VISION.md`, `ROADMAP.md`, `CHANGELOG.md`, `TODO.md`.
- Found a short-term issue: gamepad axes and button mappings are currently hardcoded in `src/ts/input.ts` but the TODO says `TODO: Make this configurable`.
- Implemented fully featured and configurable Gamepad Mappings within the Options UI for both MBG and MBP.
- Updated `options.ts` to poll for Gamepad API buttons explicitly during rebinding state.
- Bypassed resting analog trigger inputs (axis 6 & 7) from incorrectly overriding polling.

## Next Steps
- Expand Multiplayer/Online features, especially ghost racing.

- Clean up legacy Rollup plugin dependencies. Attempting to upgrade `rollup-plugin-typescript` to `@rollup/plugin-typescript` causes peer dependency cascades with `@rollup/plugin-commonjs`, currently resolved via `--legacy-peer-deps`. Resolving this may require a full rollup upgrade cycle.
