import { Menu } from "./menu";
import { state } from "../state";
import { StorageManager } from "../storage";
import { MisParser } from "../parsing/mis_parser";
import { Mission } from "../mission";
import { MissionLibrary } from "../mission_library";

export class LevelEditor {
	menu: Menu;
	div: HTMLDivElement;
	homeButton: HTMLImageElement;

	constructor(menu: Menu) {
		this.menu = menu;

		// Create a basic overlay div for the editor UI
		this.div = document.createElement('div');
		this.div.id = 'level-editor-container';
		this.div.style.position = 'absolute';
		this.div.style.top = '0';
		this.div.style.left = '0';
		this.div.style.width = '100%';
		this.div.style.height = '100%';
		this.div.style.zIndex = '1000';
		this.div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		this.div.classList.add('hidden');

		let title = document.createElement('h1');
		title.textContent = 'Level Editor (WIP)';
		title.style.color = 'white';
		title.style.textAlign = 'center';
		this.div.appendChild(title);

		this.homeButton = document.createElement('img');
		this.homeButton.style.position = 'absolute';
		this.homeButton.style.top = '20px';
		this.homeButton.style.left = '20px';
		this.homeButton.style.cursor = 'pointer';
		// Fallback home icon until specific editor assets exist
		menu.setupButton(this.homeButton, 'play/prev', () => {
			this.hide();
			menu.home.show();
		});
		this.div.appendChild(this.homeButton);

		let toolsPanel = document.createElement('div');
		toolsPanel.style.position = 'absolute';
		toolsPanel.style.right = '20px';
		toolsPanel.style.top = '100px';
		toolsPanel.style.width = '300px';
		toolsPanel.style.backgroundColor = 'rgba(50, 50, 50, 0.9)';
		toolsPanel.style.padding = '10px';
		toolsPanel.style.color = 'white';
		toolsPanel.style.borderRadius = '8px';
		toolsPanel.style.display = 'flex';
		toolsPanel.style.flexDirection = 'column';
		toolsPanel.style.gap = '10px';

		let loadLabel = document.createElement('h3');
		loadLabel.textContent = 'Saved Levels';
		toolsPanel.appendChild(loadLabel);

		let levelList = document.createElement('select');
		levelList.size = 5;
		toolsPanel.appendChild(levelList);

		let loadBtn = document.createElement('button');
		loadBtn.textContent = 'Load Selected';
		loadBtn.onclick = async () => {
			if (levelList.value) {
				let misStr = await StorageManager.databaseGet('keyvalue', levelList.value) as string;
				if (misStr) {
					try {
						let misFile = new MisParser(misStr).parse();
						let newMission = Mission.fromMisFile('custom/editor/' + levelList.value, misFile);
						MissionLibrary.allMissions.push(newMission);
						alert("Loaded mission!");
					} catch(e) {
						alert("Failed to parse mission");
					}
				}
			}
		};
		toolsPanel.appendChild(loadBtn);

		let saveBtn = document.createElement('button');
		saveBtn.textContent = 'Save New Level';
		saveBtn.onclick = async () => {
			let name = prompt("Enter level name:");
			if (name) {
				// Stub: we'd serialize the live scene graph here
				let misStr = this.serializeMission();
				await StorageManager.databasePut('keyvalue', misStr, 'editorLevel_' + name);
				this.refreshLevelList(levelList);
				alert("Saved level to local storage!");
			}
		};
		toolsPanel.appendChild(saveBtn);

		this.div.appendChild(toolsPanel);

		// Initial populate
		this.refreshLevelList(levelList);

		let toolBar = document.createElement('div');
		toolBar.style.position = 'absolute';
		toolBar.style.bottom = '20px';
		toolBar.style.left = '50%';
		toolBar.style.transform = 'translateX(-50%)';
		toolBar.style.display = 'flex';
		toolBar.style.gap = '10px';

		let placeShapeBtn = document.createElement('button');
		placeShapeBtn.textContent = 'Place Shape';
		placeShapeBtn.onclick = () => alert("Shape placement coming soon.");

		let exportBtn = document.createElement('button');
		exportBtn.textContent = 'Export .mis';
		exportBtn.onclick = () => alert("Export coming soon.");

		toolBar.appendChild(placeShapeBtn);
		toolBar.appendChild(exportBtn);
		this.div.appendChild(toolBar);

		document.body.appendChild(this.div);
	}

	async init() {
		// Load necessary editor UI textures
	}

	/** Converts the current level state back into a .mis file string */
	serializeMission() {
		// Basic stub for mission serialization
		let misString = "//--- OBJECT WRITE BEGIN ---\n";
		misString += "new SimGroup(MissionGroup) {\n";

		// In the future, this iterates state.level.shapes, interiors, etc.
		// For now, inject a basic info block
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

		misString += "};\n";
		misString += "//--- OBJECT WRITE END ---";

		return misString;
	}

	show() {
		this.div.classList.remove('hidden');
		// Optional: Boot into a blank simulation environment
	}

	hide() {
		this.div.classList.add('hidden');
	}

	async refreshLevelList(list: HTMLSelectElement) {
		list.innerHTML = '';
		let keys = await StorageManager.databaseGetAllKeys('keyvalue');
		for (let key of keys) {
			if (typeof key === 'string' && key.startsWith('editorLevel_')) {
				let opt = document.createElement('option');
				opt.value = key;
				opt.textContent = key.replace('editorLevel_', '');
				list.appendChild(opt);
			}
		}
	}

}
