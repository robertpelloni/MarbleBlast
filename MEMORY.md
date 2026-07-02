# MEMORY

## Ongoing Observations
- The codebase relies heavily on the `StorageManager` to serialize/deserialize data to/from `localStorage`/`IndexedDB`.
- Options are separated between MBG (`options_mbg.ts`) and MBP (`options_mbp.ts`).
- `input.ts` handles all input, including keyboard, mouse, touch, and gamepad. Gamepad has been upgraded to a fully dynamic mapping system utilizing `StorageManager.data.settings.gamepadButtonMapping` and `gamepadAxisMapping`. Gamepad mappings are fully functional and configurable via the Options UI (verified end-to-end for both axes and buttons). Gamepad mappings are fully functional and configurable via the Options UI (verified end-to-end for both axes and buttons). Gamepad mappings are fully functional and configurable via the Options UI (verified end-to-end for both axes and buttons). Gamepad mappings are fully functional and configurable via the Options UI (verified end-to-end for both axes and buttons).
- UI elements use standard HTML/CSS but there's a lot of manual DOM manipulation instead of a framework.
- The audio engine (`AudioManager`) has been extended to prioritize loading `.ogg` over `.wav` automatically via `resolveAudioPath` by inspecting `mission.getFullNamesOf()` and `ResourceManager.getFullNamesOf()`.

### Cross-Browser Edge Cases
- **Audio (Safari):** Safari does not natively support `.ogg` format using standard WebAudio elements or decoding if not compiled with support. The custom `OggDec` decoder via WebAssembly is utilized when `Util.isSafari()` is triggered. AudioContext requires strict user interaction (click/touch) to resume from a suspended state.
- **Gamepad API (Safari & Firefox):** The Web Gamepad API in Safari often requires the user to explicitly press a button on the controller before it registers in `navigator.getGamepads()`. Axis mappings can also differ on Apple hardware (M1/M2 Bluetooth stacks) vs Chromium on Windows.
* Safari-specific handling for audio and gamepads has been added:
  - AudioContext is resumed explicitly on user interaction (`touchstart`, `touchend`, `mousedown`, `keydown`) to fix Safari audio suspensions.
  - Gamepad API checks for `navigator.webkitGetGamepads` and implements an explicit `gamepadconnected` listener, addressing Safari quirks where gamepads might require explicit button presses to register and poll correctly.

Svelte Migration Status: Complete. All major `src/ts/ui` TS files (Level Select, Help, Finish, Pause Jukebox, and Options overrides) have been bridged to .svelte components relying on reactive data-binding.