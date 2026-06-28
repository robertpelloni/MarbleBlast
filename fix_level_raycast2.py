import re

file_path = "src/ts/level.ts"

with open(file_path, "r") as f:
    content = f.read()

target = "getRaycastIntersection(pointer: {x: number, y: number}) {"
replacement = "getRaycastIntersection(pointer: {x: number, y: number}): any {"

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Patched src/ts/level.ts to add return type any")
