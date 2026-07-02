import { Menu } from "./menu";
import { state } from "../state";
import { StorageManager } from "../storage";
import { MisParser } from "../parsing/mis_parser";
import { Mission } from "../mission";
import { MissionLibrary } from "../mission_library";
// @ts-ignore
import LevelEditorSvelte from "./svelte/LevelEditor.svelte";

export class LevelEditor {
	menu: Menu;

	constructor(menu: Menu) {
		this.menu = menu;

		(this as any).svelteComponent = new LevelEditorSvelte({
			target: document.body,
			props: {
				StorageManager,
				state,
				MisParser,
				Mission,
				MissionLibrary,
				hideEditor: () => {
					this.hide();
					menu.home.show();
				},
				serializeMission: () => this.serializeMission()
			}
		});

		(this as any).svelteComponent.$on('clickRaycast', (e: CustomEvent) => {
			this.handleRaycast(e.detail);
		});
	}

	async init() {
		// Event listener logic moved to Svelte component and handleRaycast
	}

	handleRaycast(e: MouseEvent | undefined) {
		if (!state.level || !(this as any).svelteComponent?.visible || !e) return;

		let pointer = {
			x: (e.clientX / window.innerWidth) * 2 - 1,
			y: -(e.clientY / window.innerHeight) * 2 + 1
		};

		let hit = state.level.getRaycastIntersection(pointer);
		if (hit && hit.length > 0) {
			let firstHit = hit[0];
			console.log("Editor raycast hit:", firstHit.object.name, "at", firstHit.point);
			state.menu.showAlertPopup("Editor Hit", "Selected: " + (firstHit.object.name || "Unknown") + "\nPos: " + firstHit.point.toArray().map((x: number) => x.toFixed(2)).join(', '));
		} else {
			console.log("Editor clicked empty space");
		}
	}

	selectObject(obj: any) {
		console.log("Selected object in editor:", obj);
		// Future: Populate object properties in the tools panel
	}

	/** Converts the current level state back into a .mis file string */
	serializeMission() {
		// Advanced stub: pull spawned elements dynamically if in level
		let misString = "//--- OBJECT WRITE BEGIN ---\n";
		misString += "new SimGroup(MissionGroup) {\n";

		// Basic info block
		misString += "  new ScriptObject(MissionInfo) {\n";
		misString += "    name = \"New Editor Level\";\n";
		misString += "    desc = \"Created in the MarbleBlast Web Editor.\";\n";
		misString += "    type = \"Custom\";\n";
		misString += "  };\n";

		misString += "  new MissionArea(MissionArea) {\n";
		misString += "    area = \"-360 -648 720 1296\";\n";
		misString += "    flightCeiling = \"300\";\n";
		misString += "    flightCeilingRange = \"20\";\n";
		misString += "  };\n";

		misString += "  new Sky(Sky) {\n";
		misString += "    materialList = \"~/data/skies/sky_day.dml\";\n";
		misString += "  };\n";

		misString += "  new StaticShape(StartPoint) {\n";
		misString += "    position = \"0 0 0\";\n";
		misString += "    rotation = \"1 0 0 0\";\n";
		misString += "    scale = \"1 1 1\";\n";
		misString += "    datablock = \"StartPad\";\n";
		misString += "  };\n";

		if (state.level) {
			for (let shape of state.level.shapes) {
				if (shape.isTSStatic) {
					let pos = shape.worldPosition;
					misString += "  new TSStatic() {\n";
					misString += "    position = \"" + pos.x + " " + pos.y + " " + pos.z + "\";\n";
					misString += "    rotation = \"1 0 0 0\";\n";
					misString += "    scale = \"1 1 1\";\n";
					misString += "    shapeName = \"~/" + shape.dtsPath + "\";\n";
					misString += "  };\n";
				}
			}
		}

		misString += "};\n";
		misString += "//--- OBJECT WRITE END ---";

		return misString;
	}

	show() {
		if ((this as any).svelteComponent) (this as any).svelteComponent.$set({ visible: true });
		// In a real implementation this would invoke input.setTouchControlMode directly.
		// Since we cannot use dynamic imports in this es module build, we use the global window event or a state hook.
		if (state.menu && state.menu.hud) {
			// Trigger a custom event to enable touch mode for editor in input.ts
			window.dispatchEvent(new CustomEvent('enableEditorTouchMode'));
		}
	}

	hide() {
		if ((this as any).svelteComponent) (this as any).svelteComponent.$set({ visible: false });
		window.dispatchEvent(new CustomEvent('disableEditorTouchMode'));
	}

}
