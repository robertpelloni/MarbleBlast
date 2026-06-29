import re

file_path = "src/ts/ui/editor.ts"

with open(file_path, "r") as f:
    content = f.read()

target = "state.menu.showAlertPopup(\"Editor Hit\", \"Selected: \" + (firstHit.object.name || \"Unknown\") + \"\\nPos: \" + firstHit.point.toArray().map(x => x.toFixed(2)).join(', '));"
replacement = "state.menu.showAlertPopup(\"Editor Hit\", \"Selected: \" + (firstHit.object.name || \"Unknown\") + \"\\nPos: \" + firstHit.point.toArray().map((x: number) => x.toFixed(2)).join(', '));"

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Patched src/ts/ui/editor.ts for x: number")
