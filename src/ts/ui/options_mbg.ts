import { StorageManager } from "../storage";
import { Util } from "../util";
import { Menu } from "./menu";
import { OptionsScreen } from "./options";

export class MbgOptionsScreen extends OptionsScreen {
	constructor(menu: Menu) {
		super(menu);
	}

	initProperties() {}

	async init() {
		// No manual DOM init needed, Svelte handles it.
	}

	refreshKeybindings() {
		super.refreshKeybindings();
	}
}
