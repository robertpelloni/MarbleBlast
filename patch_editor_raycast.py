import re

file_path = "src/ts/ui/editor.ts"

with open(file_path, "r") as f:
    content = f.read()

target = """	async init() {
		// Set up basic click listeners for rudimentary raycasting integration
		this.div.addEventListener('click', (e) => {
			// This will be fleshed out by hooking into three.js Raycaster
			// when the level is active. For now, it logs the attempt.
			if (state.level) {
				console.log(`Editor clicked at X:${e.clientX}, Y:${e.clientY}`);
				// Simulated raycast hit trigger
				// let hit = state.level.scene.raycast(e.clientX, e.clientY);
			}
		});
	}"""

replacement = """	async init() {
		// Advanced Raycasting integration for visual geometry arranging
		this.div.addEventListener('click', (e) => {
			if (!state.level || this.div.classList.contains('hidden')) return;

			// Normalize coordinates
			let pointer = {
				x: (e.clientX / window.innerWidth) * 2 - 1,
				y: -(e.clientY / window.innerHeight) * 2 + 1
			};

			// If level implements raycaster, we'd use it here.
			// Stubbing the call to the future raycast method on state.level
			if ('getRaycastIntersection' in state.level) {
				// let hit = (state.level as any).getRaycastIntersection(pointer);
				// if (hit) this.selectObject(hit.object);
			} else {
				console.log(`[Editor] Click at normalized X:${pointer.x.toFixed(2)}, Y:${pointer.y.toFixed(2)}. Raycaster not fully mounted in level.ts yet.`);
			}
		});
	}

	selectObject(obj: any) {
		console.log("Selected object in editor:", obj);
		// Future: Populate object properties in the tools panel
	}"""

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)
print("Patched src/ts/ui/editor.ts")
