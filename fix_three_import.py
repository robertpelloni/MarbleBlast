import os
import re

file_path = "src/ts/level.ts"

with open(file_path, "r") as f:
    content = f.read()

# Just map it to the actual three.js build we use if it's external, or maybe it's "three" but it was a duplicate import? Let's check imports
print("Imports in level.ts:")
for line in content.split('\\n')[:20]:
    if line.startswith("import"):
        print(line)
