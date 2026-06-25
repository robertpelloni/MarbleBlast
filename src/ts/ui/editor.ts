import { Menu } from "./menu";
import { state } from "../state";

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

	show() {
		this.div.classList.remove('hidden');
		// Optional: Boot into a blank simulation environment
	}

	hide() {
		this.div.classList.add('hidden');
	}
}
