# Modding Marble Blast Web

Marble Blast Web supports a robust custom asset pipeline that enables players and creators to load and play custom content natively within the browser, without requiring complex build steps.

## Custom Levels (`.mis` files)
The engine supports direct drag-and-drop ingestion of Torque 3D mission files (`.mis`).
1. Drag any `.mis` file onto the browser window.
2. The engine will intercept the file via the `input.ts` drop handler.
3. `MisParser` will parse the raw string into a structured JSON/Object format.
4. The mission is injected into the `MissionLibrary` dynamically, allowing it to be played immediately from the Custom levels tab.

## Static Geometry (`.dif` files)
Interior files containing BSP trees and static collision data are loaded natively.
When a `.mis` file references a `.dif` in its `InteriorInstance` blocks, the `ResourceManager` will attempt to fetch it from the relative asset path. Modders can inject `.dif` buffers directly into the IndexedDB to overwrite specific interiors.

## 3D Models (`.dts` files)
The game uses a custom Torque Shape `.dts` parser.
Like `.dif` files, if a `.mis` file requests a `.dts` path, `ResourceManager` fetches and parses it, constructing Three.js-compatible `Group` and `Mesh` structures internally.

## Audio Replacement
The `AudioManager` now natively supports `.ogg` Vorbis fallback. If a mod explicitly requests a `.wav` file, but you prefer to supply a smaller `.ogg` file to save bandwidth, simply place the `.ogg` file in the same directory. The engine will automatically prioritize `.ogg` over `.wav`.

## The Level Editor
An in-browser Level Editor is currently being prototyped. It uses the `StorageManager` to serialize state back into `.mis`-compatible syntax and stores it in the browser's IndexedDB for persistence across sessions.
