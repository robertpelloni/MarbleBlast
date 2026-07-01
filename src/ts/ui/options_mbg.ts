import { StorageManager } from "../storage";
import { Util } from "../util";
import { Menu } from "./menu";
import { OptionsScreen } from "./options";

export class MbgOptionsScreen extends OptionsScreen {
	constructor(menu: Menu) {
		super(menu);
	}

	initProperties() {
		this.rebindConfirmWarningEnding = "Rebind anyway?";
		this.rebindConfirmYesSrc = 'options/yes';
		this.rebindConfirmNoSrc = 'options/no';

		this.menu.setupButton(this.rebindConfirmYes, this.rebindConfirmYesSrc, () => {
			if (this.currentlyRebindingGamepad) {
				this.setGamepadKeybinding(this.currentlyRebinding, this.rebindValue);
			} else {
				this.setKeybinding(this.currentlyRebinding, this.rebindValue);
			}
		});
		this.menu.setupButton(this.rebindConfirmNo, this.rebindConfirmNoSrc, () => {
			this.currentlyRebinding = null;
			this.rebindValue = null;
			this.rebindConfirm.classList.add('hidden');
		});
	}

	async init() {
		// No manual DOM init needed, Svelte handles it.
	}

	refreshKeybindings() {
		super.refreshKeybindings();
	}
}
