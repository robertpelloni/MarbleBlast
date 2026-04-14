# MEMORY

## Ongoing Observations
- The codebase relies heavily on the `StorageManager` to serialize/deserialize data to/from `localStorage`/`IndexedDB`.
- Options are separated between MBG (`options_mbg.ts`) and MBP (`options_mbp.ts`).
- `input.ts` handles all input, including keyboard, mouse, touch, and gamepad. Gamepad is currently hardcoded for buttons/axes.
- UI elements use standard HTML/CSS but there's a lot of manual DOM manipulation instead of a framework.
