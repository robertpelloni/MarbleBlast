# MEMORY

## Ongoing Observations
- The codebase relies heavily on the `StorageManager` to serialize/deserialize data to/from `localStorage`/`IndexedDB`.
- Options are separated between MBG (`options_mbg.ts`) and MBP (`options_mbp.ts`).
- `input.ts` handles all input, including keyboard, mouse, touch, and gamepad. Gamepad has been upgraded to a fully dynamic mapping system utilizing `StorageManager.data.settings.gamepadButtonMapping` and `gamepadAxisMapping`.
- UI elements use standard HTML/CSS but there's a lot of manual DOM manipulation instead of a framework.
- The audio engine (`AudioManager`) has been extended to prioritize loading `.ogg` over `.wav` automatically via `resolveAudioPath` by inspecting `mission.getFullNamesOf()` and `ResourceManager.getFullNamesOf()`.
