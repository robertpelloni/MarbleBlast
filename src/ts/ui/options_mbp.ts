import { StorageManager } from "../storage";
import { Util } from "../util";
import { Menu } from "./menu";
import { OptionsScreen } from "./options";

export const FRAME_RATE_OPTIONS = [30, 60, 90, 120, 144, 165, 240, 360, Infinity];

export class MbpOptionsScreen extends OptionsScreen {
	constructor(menu: Menu) {
		super(menu);
	}

	initProperties() {}

	async init() {
		// Svelte handles initialization now
	}

	refreshKeybindings() {
		super.refreshKeybindings();
	}
}
