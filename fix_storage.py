import re

file_path = "src/ts/storage.ts"

with open(file_path, "r") as f:
    content = f.read()

content = content.replace("joystickSize: number,", "", 1)
content = content.replace("joystickSize: 250,", "", 1)

with open(file_path, "w") as f:
    f.write(content)

print("Patched src/ts/storage.ts")
