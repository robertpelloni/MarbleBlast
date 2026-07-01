import { state } from "../state";
import { StorageManager } from "../storage";
import { Util } from "../util";
import { Menu } from "./menu";

export const buttonToDisplayNameMbg: Record<keyof typeof StorageManager.data.settings.gameButtonMapping, string> = {
	up: 'Move Forward',
	down: 'Move Backward',
	left: 'Move Left',
	right: 'Move Right',
	use: 'Use PowerUp',
	jump: 'Jump',
	cameraUp: 'Rotate Camera Up',
	cameraDown: 'Rotate Camera Down',
	cameraLeft: 'Rotate Camera Left',
	cameraRight: 'Rotate Camera Right',
	freeLook: 'Free Look',
	restart: 'Restart',
	blast: 'Use Blast'
};
export const buttonToDisplayNameMbp: Record<keyof typeof StorageManager.data.settings.gameButtonMapping, string> = {
	up: 'Move Forward',
	down: 'Move Backward',
	left: 'Move Left',
	right: 'Move Right',
	use: 'Use PowerUp',
	jump: 'Jump',
	cameraUp: 'Look Up',
	cameraDown: 'Look Down',
	cameraLeft: 'Look Left',
	cameraRight: 'Look Right',
	freeLook: 'Free Look',
	restart: 'Respawn',
	blast: 'Use Blast'
};

export abstract class OptionsScreen {
	menu: Menu;
	div: HTMLDivElement;
	homeButton: HTMLImageElement;
	homeButtonSrc: string;

	/** Stores the button that's currently being rebound. */
	currentlyRebinding: keyof typeof StorageManager.data.settings.gameButtonMapping = null;
	/** Specifies if we are rebinding a gamepad rather than a keyboard mapping */
	currentlyRebindingGamepad = false;
	/** Stores the value that we currently want to rebind to. */
	rebindValue: string = null;
	rebindDialog: HTMLDivElement;
	rebindConfirm: HTMLDivElement;
	rebindConfirmYes: HTMLImageElement;
	rebindConfirmNo: HTMLImageElement;
	rebindConfirmYesSrc: string;
	rebindConfirmNoSrc: string;

	rebindConfirmWarningEnding = `Do you want to undo this<br>mapping?`;

	constructor(menu: Menu) {
		this.menu = menu;
		this.initProperties();

		menu.setupButton(this.homeButton, this.homeButtonSrc, () => {
			this.hide();
			menu.home.show();
		}, undefined, undefined, state.modification === 'gold');

		window.addEventListener('keydown', (e) => {
			if (!this.currentlyRebinding || this.rebindValue) return;

			if (e.code === 'Escape') {
				// Exits keybinding without changing anything
				this.currentlyRebinding = null;
				this.rebindDialog.classList.add('hidden');
			} else {
				this.setKeybinding(this.currentlyRebinding, e.code);
			}
		});

		window.addEventListener('mousedown', (e) => {
			if (!this.currentlyRebinding || this.rebindValue || this.currentlyRebindingGamepad) return;

			let buttonName = ["LMB", "MMB", "RMB"][e.button];
			if (!buttonName) return;

			this.setKeybinding(this.currentlyRebinding, buttonName);
		});

		menu.setupButton(this.rebindConfirmYes, this.rebindConfirmYesSrc, () => {
			if (this.currentlyRebindingGamepad) {
				// Gamepad rebinding
				// Find and clear other identical bindings
				let axisName = this.rebindValue.startsWith('axis') ? this.rebindValue.substring(0, 5) : '';
				if (axisName) {
					for (let i = 0; i < StorageManager.data.settings.gamepadAxisMapping.length; i++) {
						if (StorageManager.data.settings.gamepadAxisMapping[i] === axisName && StorageManager.data.settings.gamepadAxisMapping[i] !== this.currentlyRebinding) {
							StorageManager.data.settings.gamepadAxisMapping[i] = '';
						}
					}
					// Map axis mappings. Not supported yet visually but logical.
				} else if (this.rebindValue.startsWith('gamepadButton')) {
					let btnIndex = parseInt(this.rebindValue.replace('gamepadButton', ''));
					StorageManager.data.settings.gamepadButtonMapping[btnIndex] = this.currentlyRebinding;
				}
				StorageManager.store();
			} else {
				// Keyboard/Mouse rebinding
				for (let key in StorageManager.data.settings.gameButtonMapping) {
					let typedKey = key as keyof typeof StorageManager.data.settings.gameButtonMapping;
					let otherValue = StorageManager.data.settings.gameButtonMapping[typedKey];

					if (otherValue === this.rebindValue) StorageManager.data.settings.gameButtonMapping[typedKey] = '';
				}

				StorageManager.data.settings.gameButtonMapping[this.currentlyRebinding] = this.rebindValue;
				StorageManager.store();
			}

			this.currentlyRebinding = null;
			this.currentlyRebindingGamepad = false;
			this.rebindValue = null;
			this.rebindConfirm.classList.add('hidden');
			this.refreshKeybindings();
		});
		menu.setupButton(this.rebindConfirmNo, this.rebindConfirmNoSrc, () => {
			// Cancel the rebinding process.
			this.currentlyRebinding = null;
			this.rebindValue = null;
			this.rebindConfirm.classList.add('hidden');
		});
	}

	abstract initProperties(): void;

	async init() {}

	show() {
		this.div.classList.remove('hidden');
	}

	hide() {
		this.div.classList.add('hidden');
	}

	abstract refreshKeybindings(): void;

	/** Re-renders dynamic keybinding elements using a lightweight event-driven template approach */
	renderReactiveKeybindings(container: HTMLElement, mappingSource: any, isGamepad: boolean) {
		// Used by sub-classes to bind state changes safely.
	}

	/** Re-renders dynamic keybinding elements using a lightweight event-driven template approach */

	/** Returns a nice string representation of the key that a button is bound to. */
	formatKeybinding(button: keyof typeof StorageManager.data.settings.gameButtonMapping) {
		let str = Util.getKeyForButtonCode(StorageManager.data.settings.gameButtonMapping[button as keyof typeof StorageManager.data.settings.gameButtonMapping]);
		if (str.startsWith('the')) return str.slice(str.indexOf(' ') + 1, str.lastIndexOf(' ')); // If the string starts with 'the', then it's a mouse button, and we clean it up by only keeping the middle part (dropping 'the' and 'button')
		else return str;
	}

	formatGamepadKeybindingForButton(button: keyof typeof StorageManager.data.settings.gameButtonMapping) {
		for (let i = 0; i < StorageManager.data.settings.gamepadButtonMapping.length; i++) {
			if (StorageManager.data.settings.gamepadButtonMapping[i] === button) {
				return this.formatGamepadKeybinding('gamepadButton' + i);
			}
		}
		for (let i = 0; i < StorageManager.data.settings.gamepadAxisMapping.length; i++) {
			// Because axis are analog and can be split into positive/negative signs, check both
			if (StorageManager.data.settings.gamepadAxisMapping[i] === button + 'Positive') {
				return this.formatGamepadKeybinding('axis' + i + 'sign1');
			}
			if (StorageManager.data.settings.gamepadAxisMapping[i] === button + 'Negative') {
				return this.formatGamepadKeybinding('axis' + i + 'sign-1');
			}
			if (StorageManager.data.settings.gamepadAxisMapping[i] === button) {
				return this.formatGamepadKeybinding('axis' + i + 'sign1');
			}
		}
		return 'None';
	}

	formatGamepadKeybinding(value: string) {
		if (!value) return 'None';
		if (value.startsWith('gamepadButton')) {
			let index = value.replace('gamepadButton', '');
			let mapping: Record<string, string> = {
				'0': 'A / Cross',
				'1': 'B / Circle',
				'2': 'X / Square',
				'3': 'Y / Triangle',
				'4': 'L1',
				'5': 'R1',
				'6': 'L2',
				'7': 'R2',
				'8': 'Select / Share',
				'9': 'Start / Options',
				'10': 'L3',
				'11': 'R3',
				'12': 'D-Pad Up',
				'13': 'D-Pad Down',
				'14': 'D-Pad Left',
				'15': 'D-Pad Right',
				'16': 'Home / Guide',
				'17': 'Capture'
			};
			return mapping[index] || ('Button ' + index);
		}
		if (value.startsWith('axis')) {
			return value;
		}
		return 'None';
	}

	/** Starts the rebinding process and shows a dialog. */
	changeKeybinding(button: keyof typeof StorageManager.data.settings.gameButtonMapping, isGamepad = false) {
		if (Util.isTouchDevice) return; // Don't

		let map = (state.modification === 'gold')? buttonToDisplayNameMbg : buttonToDisplayNameMbp;
		this.rebindDialog.classList.remove('hidden');
		this.rebindDialog.children[1].innerHTML = `Press a new ${isGamepad ? 'gamepad button/axis' : 'key or mouse button'} for<br>"${map[button]}"`;
		this.currentlyRebinding = button;
		this.currentlyRebindingGamepad = isGamepad;

		if (isGamepad) {
			this.pollGamepadForRebind();
		}
	}

	pollGamepadForRebind() {
		if (!this.currentlyRebinding || !this.currentlyRebindingGamepad || this.rebindValue) return;

		let gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
		for (let g = 0; g < gamepads.length; g++) {
			let pad = gamepads[g];
			if (!pad) continue;

			// Check buttons
			for (let i = 0; i < pad.buttons.length; i++) {
				if (pad.buttons[i].value > 0.5) {
					// Ignore L2/R2 resting triggers
					if (i === 6 || i === 7) continue;
					this.setGamepadKeybinding(this.currentlyRebinding, 'gamepadButton' + i);
					return;
				}
			}

			// Check axes
			for (let i = 0; i < pad.axes.length; i++) {
				if (Math.abs(pad.axes[i]) > 0.5) {
					let sign = pad.axes[i] > 0 ? 1 : -1;
					this.setGamepadKeybinding(this.currentlyRebinding, 'axis' + i + 'sign' + sign);
					return;
				}
			}
		}

		requestAnimationFrame(() => this.pollGamepadForRebind());
	}

	setGamepadKeybinding(button: keyof typeof StorageManager.data.settings.gameButtonMapping, value: string) {
		let map = (state.modification === 'gold')? buttonToDisplayNameMbg : buttonToDisplayNameMbp;

		// Note: Gamepad binding has a completely different logic since gameButtonMapping isn't populated here.
		// For MVP, we will directly assign it unless there's a conflict.
		// Let's check for conflicts.
		let conflict = '';
		if (value.startsWith('gamepadButton')) {
			let btnIndex = parseInt(value.replace('gamepadButton', ''));
			conflict = StorageManager.data.settings.gamepadButtonMapping[btnIndex];
		}
		// (Skipping complex axis mapping checking for simplicity in this port version unless we build an axis mapping index)

		if (conflict && conflict !== button && conflict !== '') {
			let conflictKey = conflict as keyof typeof StorageManager.data.settings.gameButtonMapping;
			this.rebindDialog.classList.add('hidden');
			this.rebindConfirm.classList.remove('hidden');
			this.rebindConfirm.children[1].innerHTML = `"${this.formatGamepadKeybinding(value)}" is already bound to "${map[conflictKey]}"!<br>` + this.rebindConfirmWarningEnding;
			this.rebindValue = value;
			return;
		}

		// Simply store the keybind.
		if (value.startsWith('gamepadButton')) {
			// Wipe old occurrences
			for(let i = 0; i < StorageManager.data.settings.gamepadButtonMapping.length; i++) {
				if (StorageManager.data.settings.gamepadButtonMapping[i] === button) {
					StorageManager.data.settings.gamepadButtonMapping[i] = '';
				}
			}
			let btnIndex = parseInt(value.replace('gamepadButton', ''));
			StorageManager.data.settings.gamepadButtonMapping[btnIndex] = button;
		} else if (value.startsWith('axis')) {
			let axisIndex = parseInt(value.substring(4, 5));
			let sign = value.includes('sign-1') ? -1 : 1;

			// Wipe old occurrences
			for(let i = 0; i < StorageManager.data.settings.gamepadAxisMapping.length; i++) {
				if (StorageManager.data.settings.gamepadAxisMapping[i] === button + (sign === 1 ? 'Positive' : 'Negative')) {
					StorageManager.data.settings.gamepadAxisMapping[i] = '';
				}
				if (StorageManager.data.settings.gamepadAxisMapping[i] === button) {
					StorageManager.data.settings.gamepadAxisMapping[i] = '';
				}
			}

			// For analog axes, cameraX, cameraY, marbleX, marbleY are special strings that map 1:1,
			// but we can map up/down/left/right by appending 'Positive' or 'Negative'.
			let bindingStr = button;
			if (button === 'up' || button === 'cameraUp' || button === 'left' || button === 'cameraLeft') {
				bindingStr += sign === 1 ? 'Positive' : 'Negative';
			} else if (button === 'down' || button === 'cameraDown' || button === 'right' || button === 'cameraRight') {
				bindingStr += sign === 1 ? 'Positive' : 'Negative';
			}

			StorageManager.data.settings.gamepadAxisMapping[axisIndex] = bindingStr;
		}

		StorageManager.store();
		this.currentlyRebinding = null;
		this.currentlyRebindingGamepad = false;
		this.rebindDialog.classList.add('hidden');
		this.refreshKeybindings();
	}

	/** Updates the binding for a given button. */
	setKeybinding(button: keyof typeof StorageManager.data.settings.gameButtonMapping, value: string) {
		let map = (state.modification === 'gold')? buttonToDisplayNameMbg : buttonToDisplayNameMbp;

		// Check for collisions with other bindings
		for (let key in StorageManager.data.settings.gameButtonMapping) {
			let typedKey = key as keyof typeof StorageManager.data.settings.gameButtonMapping;
			let otherValue = StorageManager.data.settings.gameButtonMapping[typedKey];

			if (otherValue === value && typedKey !== button) {
				// We found another binding that binds to the same key, bring up the conflict dialog.
				this.rebindDialog.classList.add('hidden');
				this.rebindConfirm.classList.remove('hidden');
				this.rebindConfirm.children[1].innerHTML = `"${this.formatKeybinding(typedKey)}" is already bound to "${map[typedKey]}"!<br>` + this.rebindConfirmWarningEnding;
				this.rebindValue = value;

				return;
			}
		}

		// Simply store the keybind.
		StorageManager.data.settings.gameButtonMapping[button] = value;
		StorageManager.store();
		this.currentlyRebinding = null;
		this.rebindDialog.classList.add('hidden');
		this.refreshKeybindings();
	}

	showMarbleTexturePicker() {
		return new Promise<void>(resolve => {
			// Show an image picker
			let fileInput = document.createElement('input');
			fileInput.setAttribute('type', 'file');
			fileInput.setAttribute('accept', "image/x-png,image/gif,image/jpeg");

			fileInput.onchange = async () => {
				let file = fileInput.files[0];
				await StorageManager.databasePut('keyvalue', file, 'marbleTexture'); // Store the Blob in the IndexedDB
				resolve();
			};
			fileInput.click();
		});
	}
}