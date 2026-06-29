import re

file_path = "src/ts/ui/options.ts"

with open(file_path, "r") as f:
    lines = f.readlines()

# find duplicate renderReactiveKeybindings
found = 0
out_lines = []
skip = False
for line in lines:
    if "renderReactiveKeybindings" in line:
        found += 1
        if found > 1:
            skip = True

    if skip and "}" in line:
        skip = False
        continue

    if not skip:
        out_lines.append(line)

with open(file_path, "w") as f:
    f.writelines(out_lines)

print("Patched duplicate function")
