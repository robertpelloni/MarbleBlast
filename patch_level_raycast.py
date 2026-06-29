import re

file_path = "src/ts/level.ts"

with open(file_path, "r") as f:
    content = f.read()

# Add THREE raycaster imports if not present
if "import * as THREE from 'three';" not in content and "import { Raycaster" not in content:
    target = "import { Util } from \"./util\";"
    replacement = "import { Util } from \"./util\";\nimport { Raycaster, Vector2 } from \"three\";"
    content = content.replace(target, replacement)

# Add raycaster to Level class
if "raycaster: Raycaster;" not in content:
    target_class = "export class Level extends Scheduler {"
    replacement_class = "export class Level extends Scheduler {\n\traycaster: Raycaster;"
    content = content.replace(target_class, replacement_class)

    target_init = "this.audioListener = new THREE.AudioListener();"
    replacement_init = "this.audioListener = new THREE.AudioListener();\n\t\tthis.raycaster = new Raycaster();"
    content = content.replace(target_init, replacement_init)

    target_method = "	async init() {"
    replacement_method = """	/** Helper for Editor raycasting */
	getRaycastIntersection(pointer: {x: number, y: number}) {
		if (!this.raycaster || !this.camera) return null;
		this.raycaster.setFromCamera(new Vector2(pointer.x, pointer.y), this.camera);
		let intersects = this.raycaster.intersectObjects(this.scene.children, true);
		return intersects.length > 0 ? intersects[0] : null;
	}

	async init() {"""
    content = content.replace(target_method, replacement_method)

with open(file_path, "w") as f:
    f.write(content)
print("Patched src/ts/level.ts")
