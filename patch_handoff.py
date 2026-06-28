import re

file_path = "HANDOFF.md"

with open(file_path, "r") as f:
    content = f.read()

target = "## Structural Shifts & System Memories"
replacement = """4. **Network Resilience & Latency Analysis:**
   - Integrated `measurePing()` into the physics tick loop (`level.ts`).
   - Implemented an `AbortController` timeout for `fetch` inside `ResourceManager` to ensure requests fail fast.
5. **Touch UI Enhancements:**
   - Moved hardcoded virtual joystick UI settings into `StorageManager.data.settings`.

## Structural Shifts & System Memories"""

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Patched HANDOFF.md")
