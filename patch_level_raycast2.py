import re

file_path = "src/ts/level.ts"

with open(file_path, "r") as f:
    content = f.read()

target = "raycaster: Raycaster;"
replacement = "raycaster: THREE.Raycaster;"
content = content.replace(target, replacement)

target2 = "this.raycaster = new Raycaster();"
replacement2 = "this.raycaster = new THREE.Raycaster();"
content = content.replace(target2, replacement2)

target3 = "this.raycaster.setFromCamera(new Vector2(pointer.x, pointer.y), this.camera);"
replacement3 = "this.raycaster.setFromCamera(new THREE.Vector2(pointer.x, pointer.y), this.camera);"
content = content.replace(target3, replacement3)

with open(file_path, "w") as f:
    f.write(content)

print("Patched THREE namespace for raycaster")
