## 2.6.22
- Overhauled gamepad support to allow analog stick inputs to trigger digital actions (e.g. mapping right thumbstick up to jump).
- Initiated multiplayer latency analyzer core for ghost racing networking.
- Added drag and drop support for loading custom .mis files natively into the browser.
- Initialized base UI classes and overlay routing for the upcoming Level Editor.

# CHANGELOG

See `version_history.md` for historical changes.

## 2.6.19
- Added fully featured Gamepad Mapping UI to options (MBG & MBP). Users can now directly configure physical gamepad buttons to logical inputs visually.

## 2.6.18
- Refactored options mapping system for controller bindings using StorageManager dynamically.
- Included `PROJECT_STRUCTURE.md` for understanding dependencies.
- Upgraded comprehensive AI planning documentation.

## Unreleased
- Support native `Ogg/Vorbis` for uncompressed audio in older Torque files, preferring `.ogg` versions seamlessly when a `.wav` is requested.
- Initialized deep documentation: VISION, ROADMAP, TODO, AGENTS, etc.

## 2.6.21
- Synchronized upstream master branch into feature branch and vice-versa
- Resolved conflicts inside HANDOFF.md, package.json and audio.ts
