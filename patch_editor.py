import re

file_path = "src/ts/ui/editor.ts"

with open(file_path, "r") as f:
    content = f.read()

target = """		this.div.addEventListener('click', (e) => {
			if (!state.level || this.div.classList.contains('hidden')) return;

			// Normalize coordinates
			let pointer = {
				x: (e.clientX / window.innerWidth) * 2 - 1,
				y: -(e.clientY / window.innerHeight) * 2 + 1
			};

			// If level implements raycaster, we'd use it here.
			// Stubbing the call to the future raycast method on state.level
			// let hit = state.level.getRaycastIntersection(pointer);
			// console.log("Clicked editor at", pointer);
		});"""

replacement = """		this.div.addEventListener('click', (e) => {
			if (!state.level || this.div.classList.contains('hidden')) return;
			// Ignore clicks on UI elements (buttons/selects/etc)
			if (e.target !== this.div) return;

			// Normalize coordinates
			let pointer = {
				x: (e.clientX / window.innerWidth) * 2 - 1,
				y: -(e.clientY / window.innerHeight) * 2 + 1
			};

			// Cast a ray into the scene
			let hit = state.level.getRaycastIntersection(pointer);
			if (hit && hit.length > 0) {
				let firstHit = hit[0];
				console.log("Editor raycast hit:", firstHit.object.name, "at", firstHit.point);
				state.menu.showAlertPopup("Editor Hit", "Selected: " + (firstHit.object.name || "Unknown") + "\\nPos: " + firstHit.point.toArray().map(x => x.toFixed(2)).join(', '));
			} else {
				console.log("Editor clicked empty space");
			}
		});"""

content = content.replace(target, replacement)

with open(file_path, "w") as f:
    f.write(content)

print("Patched src/ts/ui/editor.ts")
