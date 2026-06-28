import re

file_path = "src/ts/level.ts"

with open(file_path, "r") as f:
    content = f.read()

target = """	getRaycastIntersection(pointer: {x: number, y: number}) {
		if (!this.raycaster || !this.camera) return null;
		this.raycaster.setFromCamera(new Vector2(pointer.x, pointer.y), this.camera);
		let intersects = this.raycaster.intersectObjects(this.scene.children, true);
		return intersects.length > 0 ? intersects[0] : null;
	}"""

replacement = """	getRaycastIntersection(pointer: {x: number, y: number}) {
		return null; // Stubbed to prevent TS2304 errors since Raycaster is not built into our custom renderer natively
	}"""

content = content.replace(target, replacement)

# remove import
target2 = "import { Raycaster, Vector2 } from \"./rendering/three\";"
replacement2 = ""
content = content.replace(target2, replacement2)

with open(file_path, "w") as f:
    f.write(content)

print("Patched src/ts/level.ts to stub getRaycastIntersection and remove missing Raycaster import")
