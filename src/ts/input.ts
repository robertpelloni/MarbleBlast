import { state } from "./state";
import { StorageManager } from "./storage";
import { MisParser } from "./parsing/mis_parser";
import { Mission } from "./mission";
import { MissionLibrary } from "./mission_library";
import { SCALING_RATIO } from "./ui/misc";
import { Util } from "./util";

export const currentMousePosition = {
	x: 0,
	y: 0
};

window.addEventListener('mousemove', (e) => {
	currentMousePosition.x = e.clientX * SCALING_RATIO;
	currentMousePosition.y = e.clientY * SCALING_RATIO;
	state.level?.onMouseMove(e);
});
window.addEventListener('touchstart', (e) => {
	let touch = e.changedTouches[0];
	currentMousePosition.x = touch.clientX * SCALING_RATIO;
	currentMousePosition.y = touch.clientY * SCALING_RATIO;
});
window.addEventListener('touchmove', (e) => {
	let touch = e.changedTouches[0];
	currentMousePosition.x = touch.clientX * SCALING_RATIO;
	currentMousePosition.y = touch.clientY * SCALING_RATIO;
});

window.addEventListener('mousedown', (e) => {
	if (!StorageManager.data) return;
	// Request pointer lock if we're currently in-game
	if (state.level && !state.level.offline && !state.level.paused && !state.level.finishTime && !Util.isTouchDevice) Util.requestPointerLock();

	let buttonName = ["LMB", "MMB", "RMB"][e.button];
	if (buttonName && document.pointerLockElement) {
		// Check if the mouse button is mapped to something
		for (let button in StorageManager.data.settings.gameButtonMapping) {
			let key = button as keyof typeof StorageManager.data.settings.gameButtonMapping;
			if (buttonName !== StorageManager.data.settings.gameButtonMapping[key]) continue;

			setPressed(key, buttonName, true);

			if (state.level) {
				if (key === 'jump' && isPressedOnce(key)) state.level.jumpQueued = true;
				if (key === 'use' && isPressedOnce(key)) state.level.useQueued = true;
				if (key === 'blast' && isPressedOnce(key)) state.level.blastQueued = true;
			}
		}
	}
});

window.addEventListener('mouseup', (e) => {
	if (!StorageManager.data) return;

	let buttonName = ["LMB", "MMB", "RMB"][e.button];
	if (buttonName) {
		for (let button in StorageManager.data.settings.gameButtonMapping) {
			let key = button as keyof typeof StorageManager.data.settings.gameButtonMapping;
			if (buttonName !== StorageManager.data.settings.gameButtonMapping[key]) continue;

			setPressed(key, buttonName, false);
		}
	}
});

window.addEventListener('keydown', (e) => {
	if (!StorageManager.data) return;

	// Check if the key button is mapped to something
	for (let button in StorageManager.data.settings.gameButtonMapping) {
		let key = button as keyof typeof StorageManager.data.settings.gameButtonMapping;
		if (e.code !== StorageManager.data.settings.gameButtonMapping[key]) continue;

		setPressed(key, e.code, true);

		if (state.level) {
			if (key === 'jump' && isPressedOnce(key)) state.level.jumpQueued = true;
			if (key === 'use' && isPressedOnce(key)) state.level.useQueued = true;
		}
	}
});

window.addEventListener('keyup', (e) => {
	if (!StorageManager.data) return;

	for (let button in StorageManager.data.settings.gameButtonMapping) {
		let key = button as keyof typeof StorageManager.data.settings.gameButtonMapping;
		if (e.code !== StorageManager.data.settings.gameButtonMapping[key]) continue;

		setPressed(key, e.code, false);
	}
});

window.addEventListener('contextmenu', (e) => e.preventDefault()); // Disable right click context menu for good

window.addEventListener('beforeunload', (e) => {
	// Ask the user if they're sure about closing the tab if they're currently in game
	if (state.level) {
		e.preventDefault();
		e.returnValue = '';
	}
});

document.addEventListener('pointerlockchange', () => {
	// When pointer lock is left, we pause.
	if (!document.pointerLockElement) state.level?.pause();
});

/** For each game button, a list of the keys/buttons corresponding to it that are currently pressed. */
const gameButtons = {
	up: [] as string[],
	down: [] as string[],
	left: [] as string[],
	right: [] as string[],
	jump: [] as string[],
	use: [] as string[],
	cameraUp: [] as string[],
	cameraDown: [] as string[],
	cameraLeft: [] as string[],
	cameraRight: [] as string[],
	freeLook: [] as string[],
	restart: [] as string[],
	pause: [] as string[],
	blast: [] as string[]
};

/** For each game button, a flag indicating whether it has been pressed since the flag was reset. Used to prevent things like entering and immediately leaving the pause menu. */
const pressedSinceFlag = {
	up: false,
	down: false,
	left: false,
	right: false,
	jump: false,
	use: false,
	cameraUp: false,
	cameraDown: false,
	cameraLeft: false,
	cameraRight: false,
	freeLook: false,
	restart: false,
	pause: false,
	blast: false
};

/** Set a button's state based on a presser. */
const setPressed = (buttonName: keyof typeof gameButtons, presser: string, state: boolean) => {
	let incl = gameButtons[buttonName].includes(presser);
	if (!state && incl) {
		gameButtons[buttonName] = gameButtons[buttonName].filter(x => x !== presser);
	} else if (state && !incl) {
		gameButtons[buttonName].push(presser);
		pressedSinceFlag[buttonName] = true;
	}
};

/** Determine if a button is pressed. */
export const isPressed = (buttonName: keyof typeof gameButtons) => {
	return (gameButtons[buttonName].length > 0);
};

/** Determine if a button is pressed by something other than LMB. */
export const isPressedByNonLMB = (buttonName: keyof typeof gameButtons) => {
	return (gameButtons[buttonName].filter(x => x !== 'LMB').length > 0);
};

/** Determine if a button is pressed by a gamepad (button or mapped axis). */
export const isPressedByGamepad = (buttonName: keyof typeof gameButtons) => {
	return gameButtons[buttonName].find(x => x.startsWith('gamepadButton') || x.startsWith('axis')) !== undefined;
};

/** Determine if a button is only pressed by one presser. */
const isPressedOnce = (buttonName: keyof typeof gameButtons) => {
	return (gameButtons[buttonName].length === 1);
};

/** Return whether a presser has pressed the button since the flag was reset. */
export const getPressedFlag = (buttonName: keyof typeof gameButtons) => {
	return pressedSinceFlag[buttonName];
};

/** Reset the pressed flag for a button. */
export const resetPressedFlag = (buttonName: keyof typeof gameButtons) => {
	pressedSinceFlag[buttonName] = false;
};

export const releaseAllButtons = () => {
	for (let key in gameButtons) {
		if (key !== 'pause')
			gameButtons[key as keyof typeof gameButtons] = [];
	}
};

/** The current position (-1 to 1) of the marble and camera axes. */
export const gamepadAxes = {
	marbleX: 0.0,
	marbleY: 0.0,
	cameraX: 0.0,
	cameraY: 0.0
};


/** The most recent controller a button was pressed on, used to select the controller to poll */
let mostRecentGamepad = 0;

/** Referring to the button state of the controller. */
export const previousButtonState = [false, false, false, false, false, false, false, false, false, false, false, false, false, false];

/** Update the input from the gamepad, if it is connected. */
const updateGamepadInput = () => {
	let gamepads = 'getGamepads' in navigator ? [...navigator.getGamepads()].filter(x => x) : [];
	if (gamepads.length === 0) {
		// No gamepad active
		for (let key in gamepadAxes) gamepadAxes[key as keyof typeof gamepadAxes] = 0.0;
		return;
	}

	// Update the most recent gamepad
	for (let i = 0; i < gamepads.length; i++) {
		for (let j = 0; j < gamepads[i].buttons.length; j++) {
			if (gamepads[i].buttons[j].value > 0.5) {
				mostRecentGamepad = i;
				break;
			}
		}
	}

	for (let i = 0; i < gamepads[mostRecentGamepad].buttons.length && i < 18; i++) {
		let state = (gamepads[mostRecentGamepad].buttons[i].value > 0.5);
		let presser = 'gamepadButton' + i;
		let buttonName = StorageManager.data?.settings.gamepadButtonMapping[i] || "";
		if (buttonName !== '')
			setPressed(buttonName as keyof typeof StorageManager.data.settings.gameButtonMapping, presser, state);
	}

	for (let i = 0; i < gamepads[mostRecentGamepad].axes.length && i < 4; i++) {
		let axisVal = gamepads[mostRecentGamepad].axes[i];
		let deadzone = 0.15; // Increased deadzone slightly to prevent drifting digital inputs
		let cleanVal = Math.abs(axisVal) < deadzone ? 0 : axisVal;

		let axisName = StorageManager.data?.settings.gamepadAxisMapping[i] || "";
		if (axisName === "") continue;

		// If it's a standard full-axis mapping (e.g. "marbleX")
		if (['marbleX', 'marbleY', 'cameraX', 'cameraY'].includes(axisName)) {
			gamepadAxes[axisName as keyof typeof gamepadAxes] = cleanVal;
			continue;
		}

		// Clear previously simulated button presses first
		for (let key in gameButtons) {
			gameButtons[key as keyof typeof gameButtons] = gameButtons[key as keyof typeof gameButtons].filter(x => !x.startsWith('axis' + i));
		}

		// It's mapped to a directional digital button like "upPositive" or "leftNegative"
		if (Math.abs(cleanVal) > deadzone) {
			let signStr = cleanVal < 0 ? 'Negative' : 'Positive';
			let possibleMatches = [
				'up' + signStr, 'down' + signStr, 'left' + signStr, 'right' + signStr,
				'jump' + signStr, 'use' + signStr, 'blast' + signStr,
				'cameraUp' + signStr, 'cameraDown' + signStr, 'cameraLeft' + signStr, 'cameraRight' + signStr
			];

			for (let match of possibleMatches) {
				if (axisName === match) {
					let actionStr = match.replace('Positive', '').replace('Negative', '');
					// Fake a button press
					let gameButtonsMap = gameButtons[actionStr as keyof typeof gameButtons];
					if (gameButtonsMap && !gameButtonsMap.includes('axis' + i + signStr)) {
						gameButtonsMap.push('axis' + i + signStr);
						window.dispatchEvent(new KeyboardEvent('keydown', { code: 'axis' + i + signStr }));
					}
				}
			}
		}
	}

	// Check for input on the level select screen
	if (state.menu?.levelSelect && !state.menu.levelSelect.div.classList.contains('hidden'))
		state.menu.levelSelect.handleControllerInput(gamepads[mostRecentGamepad]);

	if (state.level?.paused)
		state.menu.pauseScreen.handleGamepadInput(gamepads[mostRecentGamepad]);

	for (let i = 0; i < gamepads[mostRecentGamepad].buttons.length && i < 18; i++) {
		previousButtonState[i] = (gamepads[mostRecentGamepad].buttons[i].value > 0.5);
	}
};

window.setInterval(updateGamepadInput, 4);

/* TOUCH STUFF: */

export const touchInputContainer = document.querySelector('#touch-input-container') as HTMLDivElement;
const movementAreaElement = document.querySelector('#movement-area') as HTMLDivElement;
const cameraAreaElement = document.querySelector('#camera-area') as HTMLDivElement;
export const movementJoystick = document.querySelector('#movement-joystick') as HTMLDivElement;
export const movementJoystickHandle = document.querySelector('#movement-joystick-handle') as HTMLDivElement;
export const actionButtonContainer = document.querySelector('#action-buttons') as HTMLDivElement;
export const jumpButton = document.querySelector('#jump-button') as HTMLImageElement;
export const useButton = document.querySelector('#use-button') as HTMLImageElement;
export const blastButton = document.querySelector('#blast-button') as HTMLImageElement;
export const pauseButton = document.querySelector('#pause-button') as HTMLImageElement;
export const restartButton = document.querySelector('#restart-button') as HTMLImageElement;
export const freeLookButton = document.querySelector('#free-look-button') as HTMLImageElement;

export const JOYSTICK_HANDLE_SIZE_FACTOR = 2/5;
let joystickPosition: {x: number, y: number} = null;
export let normalizedJoystickHandlePosition: {x: number, y: number} = null;
let movementAreaTouchIdentifier: number = null;
let cameraAreaTouchIdentifier: number = null;
let lastCameraTouch: Touch = null;
let joystickAsCameraTouches: Touch[] = [];

export let useEnabled = false;
export let blastEnabled = false;

export const setUseEnabled = (value: boolean) => {
	useEnabled = value;
};

export const setBlastEnabled = (value: boolean) => {
	blastEnabled = value;
};


const getUseEnabledOpacityAndEnabled = () => {
	return {
		opacity: useEnabled ? '0.5' : '0.2',
		enabled: useEnabled
	};
};

const getBlastEnabledOpacityAndEnabled = () => {
	return {
		opacity: blastEnabled ? '0.5' : '0.2',
		enabled: blastEnabled
	};
};

let touchendFuncs: ((touch: Touch, force: boolean) => void)[] = [];
const setupTouchButton = (element: HTMLImageElement, button: keyof typeof gameButtons, onStart?: (touch: Touch) => void, onEnd?: (touch: Touch) => void, getOpacityAndEnabled?: () => { opacity: string, enabled: boolean }) => {
	let touchId: number = null;

	element.addEventListener('touchstart', (e) => {
		let touch = e.changedTouches[0];
		touchId = touch.identifier;

		let oaenabled = getOpacityAndEnabled?.().enabled ?? true;
		if (oaenabled)
			element.style.opacity = '0.9';
		else
			element.style.opacity = '0.4';
		setPressed(button, 'touch', true);
		onStart?.(touch);
	});

	touchendFuncs.push((touch, force) => {
		if (force || touch.identifier === touchId) {
			touchId = null;
			element.style.opacity = getOpacityAndEnabled?.().opacity ?? '';
			setPressed(button, 'touch', false);
			onEnd?.(touch);
		}
	});
};

const startCameraMovement = (touch: Touch) => {
	cameraAreaTouchIdentifier = touch.identifier;
	lastCameraTouch = touch;
};

const startCameraMovementFromButton = (touch: Touch) => {
	startCameraMovement(touch);
	joystickAsCameraTouches.push(touch);
};

const endCameraMovementFromButton = (touch: Touch) => {
	joystickAsCameraTouches.splice(joystickAsCameraTouches.indexOf(touch), 1);
};

setupTouchButton(jumpButton, 'jump', startCameraMovementFromButton, endCameraMovementFromButton);
setupTouchButton(useButton, 'use', startCameraMovementFromButton, endCameraMovementFromButton, getUseEnabledOpacityAndEnabled);
setupTouchButton(blastButton, 'blast', startCameraMovementFromButton, endCameraMovementFromButton, getBlastEnabledOpacityAndEnabled);
setupTouchButton(pauseButton, 'pause');
setupTouchButton(restartButton, 'restart');
setupTouchButton(freeLookButton, 'freeLook');

export const hideTouchControls = () => {
	touchInputContainer.style.display = 'none';
};

export const maybeShowTouchControls = () => {
	touchInputContainer.style.display = Util.isTouchDevice? 'block' : 'none';
};

export const setTouchControlMode = (mode: 'normal' | 'replay' | 'editor') => {
	if (mode === 'normal') {
		[movementJoystick, jumpButton, useButton, blastButton, freeLookButton].forEach(x => x.style.display = '');
	} else if (mode === 'replay') {
		// Hide everything but pause and replay buttons
		[movementJoystick, jumpButton, useButton, blastButton, freeLookButton].forEach(x => x.style.display = 'none');
	} else if (mode === 'editor') {
		// Keep movement but hide jump/use/blast
		[jumpButton, useButton, blastButton, freeLookButton].forEach(x => x.style.display = 'none');
		movementJoystick.style.display = '';
	}
};

movementAreaElement.addEventListener('touchstart', (e) => {
	let touch = e.changedTouches[0];
	movementAreaTouchIdentifier = touch.identifier;

	let x: number, y: number;
	let joystickSize = StorageManager.data.settings.joystickSize;
	if (StorageManager.data.settings.joystickPosition === 0) {
		// Fixed
		x = StorageManager.data.settings.joystickLeftOffset + joystickSize/2;
		y = window.innerHeight * (1 - StorageManager.data.settings.joystickVerticalPosition) * SCALING_RATIO;
	} else {
		// Dynamic
		x = Util.clamp(touch.clientX * SCALING_RATIO, joystickSize/2, (window.innerWidth * SCALING_RATIO - joystickSize) / 2);
		y = Util.clamp(touch.clientY * SCALING_RATIO, joystickSize/2, window.innerHeight * SCALING_RATIO - joystickSize / 2);
	}

	movementJoystick.style.visibility = 'visible';
	movementJoystick.style.left = x - joystickSize/2 + 'px';
	movementJoystick.style.top = y - joystickSize/2 + 'px';
	joystickPosition = {x: x, y: y};
	normalizedJoystickHandlePosition = {x: 0, y: 0};
	updateJoystickHandlePosition(touch);
});

movementAreaElement.addEventListener('touchmove', (e) => {
	let touch = [...e.changedTouches].find(x => x.identifier === movementAreaTouchIdentifier);
	if (!touch) return;

	if (touch.identifier === movementAreaTouchIdentifier) {
		updateJoystickHandlePosition(touch);
	}
});

const updateJoystickHandlePosition = (touch: Touch) => {
	let joystickSize = StorageManager.data.settings.joystickSize;
	let joystickHandleSize = JOYSTICK_HANDLE_SIZE_FACTOR * StorageManager.data.settings.joystickSize;
	let innerRadius = (joystickSize - joystickHandleSize) / 2;

	normalizedJoystickHandlePosition.x = Util.clamp((touch.clientX * SCALING_RATIO - joystickPosition.x) / innerRadius, -1, 1);
	normalizedJoystickHandlePosition.y = Util.clamp((touch.clientY * SCALING_RATIO - joystickPosition.y) / innerRadius, -1, 1);

	movementJoystickHandle.style.left = (normalizedJoystickHandlePosition.x) * innerRadius + joystickSize/2 - joystickHandleSize/2 + 'px';
	movementJoystickHandle.style.top = (normalizedJoystickHandlePosition.y) * innerRadius + joystickSize/2 - joystickHandleSize/2 + 'px';
};

window.addEventListener('touchend', (e) => {
	for (let touch of e.changedTouches) {
		if (touch.identifier === movementAreaTouchIdentifier) {
			movementAreaTouchIdentifier = null;
			movementJoystick.style.visibility = 'hidden';
			normalizedJoystickHandlePosition = null;
		}

		if (touch.identifier === cameraAreaTouchIdentifier) {
			cameraAreaTouchIdentifier = null;
		}

		for (let func of touchendFuncs) func(touch, false);
	}

	if (e.touches.length === 0) {
		// Just to be sure, end all the things. To prevent stuff from being stuck on screen forever
		movementAreaTouchIdentifier = null;
		movementJoystick.style.visibility = 'hidden';
		normalizedJoystickHandlePosition = null;

		cameraAreaTouchIdentifier = null;

		for (let func of touchendFuncs) func(null, true);
	}
});

cameraAreaElement.addEventListener('touchstart', (e) => {
	let touch = e.changedTouches[0];
	startCameraMovement(touch);
});

// Put this on touchInputContainer instead of cameraAreaElement so it also works when you start the drag on a button
touchInputContainer.addEventListener('touchmove', (e) => {
	let touch = [...e.changedTouches].find(x => x.identifier === cameraAreaTouchIdentifier);
	let level = state.level;

	if (!touch) return;

	if (touch.identifier === cameraAreaTouchIdentifier) {
		let movementX = (touch.clientX - lastCameraTouch.clientX) * SCALING_RATIO;
		let movementY = (touch.clientY - lastCameraTouch.clientY) * SCALING_RATIO;

		let factor = Util.lerp(1 / 1500, 1 / 50, StorageManager.data.settings.mouseSensitivity) * ((joystickAsCameraTouches.length !== 0) ? StorageManager.data.settings.actionButtonAsJoystickMultiplier : 1);
		let yFactor = (StorageManager.data.settings.invertMouse & 0b10)? -1 : 1;
		let freeLook = StorageManager.data.settings.alwaysFreeLook || isPressed('freeLook');

		level.yaw -= movementX * factor;
		if (freeLook) level.pitch += movementY * factor * yFactor;

		lastCameraTouch = touch;
	}
});

window.addEventListener('dragover', (e) => {
	e.preventDefault();
});

window.addEventListener('drop', async (e) => {
	e.preventDefault();
	if (!e.dataTransfer?.files.length) return;

	let file = e.dataTransfer.files[0];
	if (!file.name.endsWith('.mis')) {
		// Just a placeholder check for now, can be expanded to full .zip imports
		console.warn("Only .mis files are currently supported for drag and drop.");
		return;
	}

	try {
		let arrayBuffer = await file.arrayBuffer();
		let misString = new TextDecoder().decode(arrayBuffer);

		console.log("Successfully dropped mission file:", file.name);

		// 1. Parse the dropped mis file
		// (Avoid dynamic import to bypass TS1323)
		let misFile = new MisParser(misString).parse();

		// 2. Wrap it into a Mission object. We prefix the path to indicate it is a local drop.
		let virtualPath = 'custom/dropped/' + file.name;
		let newMission = Mission.fromMisFile(virtualPath, misFile);
		newMission.id = Math.floor(Math.random() * 10000000); // Give it a fake ID

		// 3. Inject it into MissionLibrary
		MissionLibrary.allMissions.push(newMission);

		// Add it to the correct custom array based on modification
		if (state && state.modification) {
			if (state.modification === 'gold') {
				MissionLibrary.goldCustom.push(newMission);
			} else if (state.modification === 'platinum') {
				MissionLibrary.platinumCustom.push(newMission);
			} else if (state.modification === 'ultra') {
				MissionLibrary.ultraCustom.push(newMission);
			}
		} else {
			MissionLibrary.goldCustom.push(newMission);
		}

		if (state && state.menu) {
			state.menu.showAlertPopup("Custom Level Loaded", "Loaded " + file.name + " into the custom levels tab.");
		}
	} catch (err) {
		console.error("Error reading dropped file:", err);
	}
});
