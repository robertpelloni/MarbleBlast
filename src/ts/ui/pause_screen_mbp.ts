import { state } from "../state";
import { Util } from "../util";
import { Menu } from "./menu";
import { PauseScreen } from "./pause_screen";
// @ts-ignore
import JukeboxUISvelte from "./svelte/JukeboxUI.svelte";

export const SONGS = {
	'astrolabe.ogg': 'Astrolabe',
	'beach party.ogg': 'Beach Party',
	'challenge.ogg': 'Challenge',
	'classic vibe.ogg': 'Classic Vibe',
	'comforting mystery.ogg': 'Comforting Mystery',
	'endurance.ogg': 'Endurance',
	'flanked.ogg': 'Flanked',
	'groove police.ogg': 'Groove Police',
	'grudge.ogg': 'Grudge',
	'mbp old shell.ogg': 'MBP Old Shell',
	'metropolis.ogg': 'Metropolis',
	'pianoforte.ogg': 'Pianoforte',
	'quiet lab.ogg': 'Quiet Lab',
	'rising temper.ogg': 'Rising Temper',
	'seaside revisited.ogg': 'Seaside Revisited',
	'shell.ogg': 'Shell',
	'the race.ogg': 'The Race',
	'tim trance.ogg': 'Tim Trance',
	'xmas trance.ogg': 'Xmas Trance'
};

export class MbpPauseScreen extends PauseScreen {
	jukeboxButton = document.querySelector('#mbp-pause-jukebox') as HTMLImageElement;

	initProperties() {
		this.div = document.querySelector('#mbp-pause-screen');
		this.yesButton = document.querySelector('#mbp-pause-yes');
		this.noButton = document.querySelector('#mbp-pause-no');
		this.restartButton = document.querySelector('#mbp-pause-restart');
		this.replayButton = document.querySelector('#mbp-pause-replay');

		this.yesSrc = 'exit/yes';
		this.noSrc = 'exit/no';
		this.restartSrc = 'exit/restart';
	}

	constructor(menu: Menu) {
		super(menu);
		this.menu = menu;

		(this as any).svelteComponent = new JukeboxUISvelte({
			target: document.body,
			props: {
				songs: SONGS,
				selectedIndex: null,
				playing: true,
				visible: false,
				onSelectSong: (key: string) => this.select(key),
				onTogglePlay: () => {
					if ((this as any).playing) { state.level.music?.stop(); (this as any).playing = false; }
					else {
						if ((this as any).selectedIndex !== null) this.select(Object.keys(SONGS)[(this as any).selectedIndex]);
						else {
							// Restart the default song
							state.level.music?.play();
							(this as any).playing = true;
						}
					}
					this.updateState();
				},
				onNext: () => this.select(Object.keys(SONGS)[(this as any).selectedIndex + 1]),
				onPrev: () => this.select(Object.keys(SONGS)[(this as any).selectedIndex - 1]),
				onClose: () => this.hide()
			}
		});

		window.addEventListener('keydown', (e) => {
			if ((this as any).svelteComponent?.visible && e.key === 'Escape') {
				this.hide();
			}
		});
	}

	/** Selects a given song and plays it. */
	select(song: string) {
		if (!SONGS[song as keyof typeof SONGS]) return;

		let index = Object.keys(SONGS).indexOf(song);
		(this as any).selectedIndex = index;

		let level = state.level;

		if (level.music) level.music.stop();
		level.music = level.audio.createAudioSource('music/' + song, level.audio.musicGain, undefined, true);
		level.music.setLoop(true);
		level.music.play();

		(this as any).playing = true;
		this.updateState();
	}

	show() {
		state.menu.pauseScreen.preventClose = true;

		if ((this as any).selectedIndex === null) {
			let index = Object.keys(SONGS).indexOf(state.level.originalMusicName);
			if (index >= 0) {
				(this as any).selectedIndex = index;
			}
			(this as any).playing = true;
			this.updateState();
		}

		if ((this as any).svelteComponent) (this as any).svelteComponent.$set({ visible: true });
	}

	updateState() {
		if ((this as any).svelteComponent) {
			(this as any).svelteComponent.$set({
				selectedIndex: (this as any).selectedIndex,
				playing: (this as any).playing
			});
		}
	}

	hide() {
		if ((this as any).svelteComponent) (this as any).svelteComponent.$set({ visible: false });
		state.menu.pauseScreen.preventClose = false;
	}

	reset() {
		(this as any).selectedIndex = null;
	}
}