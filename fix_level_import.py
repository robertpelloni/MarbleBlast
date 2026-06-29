import re

file_path = "src/ts/level.ts"

with open(file_path, "r") as f:
    content = f.read()

target = "import { Raycaster, Vector2 } from \"three\";"
replacement = "import { Raycaster, Vector2 } from \"./rendering/three\";"

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Patched src/ts/level.ts to import Raycaster from local three module")
