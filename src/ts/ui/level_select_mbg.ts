import { mainAudioManager } from "../audio";
import { Mission } from "../mission";
import { BestTimes } from "../storage";
import { Util } from "../util";
import { MissionLibrary } from "../mission_library";
import { LevelSelect } from "./level_select";

export class MbgLevelSelect extends LevelSelect {
	tabBeginner: HTMLImageElement;
	tabIntermediate: HTMLImageElement;
	tabAdvanced: HTMLImageElement;
	tabCustom: HTMLImageElement;
	loadReplayButton: HTMLImageElement;
	shuffleButton: HTMLImageElement;
	levelNumberElement: HTMLParagraphElement;

	localScoresCount = 3;
	scorePlaceholderName = "Nardo Polo";
	scoreElementHeight = 14;

	initProperties() {
		this.div = document.querySelector('#level-select');
		this.homeButton = document.querySelector('#level-select-home-button');
		this.homeButtonSrc = 'play/back';
		this.tabBeginner = document.querySelector('#tab-beginner') as HTMLImageElement;
		this.tabIntermediate = document.querySelector('#tab-intermediate') as HTMLImageElement;
		this.tabAdvanced = document.querySelector('#tab-advanced') as HTMLImageElement;
		this.tabCustom = document.querySelector('#tab-custom') as HTMLImageElement;
		this.scrollWindow = document.querySelector('#level-select-text-window-scrollable') as HTMLDivElement;
		this.levelTitle = document.querySelector('#level-title') as HTMLParagraphElement;
		this.levelArtist = document.querySelector('#level-artist') as HTMLParagraphElement;
		this.levelDescription = document.querySelector('#level-description') as HTMLParagraphElement;
		this.levelQualifyTime = document.querySelector('#level-qualify-time') as HTMLParagraphElement;
		this.localBestTimesContainer = document.querySelector('#level-select-local-best-times') as HTMLDivElement;
		this.leaderboardLoading = document.querySelector('#online-leaderboard-loading') as HTMLParagraphElement;
		this.leaderboardScores = document.querySelector('#leaderboard-scores') as HTMLDivElement;
		this.levelImage = document.querySelector('#level-image') as HTMLImageElement;
		this.levelNumberElement = document.querySelector('#level-number') as HTMLParagraphElement;
		this.prevButton = document.querySelector('#level-select-prev') as HTMLImageElement;
		this.playButton = document.querySelector('#level-select-play') as HTMLImageElement;
		this.nextButton = document.querySelector('#level-select-next') as HTMLImageElement;
		this.searchInput = document.querySelector('#search-input') as HTMLInputElement;
		this.sortToggleButton = document.querySelector('#sort-icon') as HTMLImageElement;
		this.loadReplayButton = document.querySelector('#load-replay-button') as HTMLImageElement;
		this.shuffleButton = document.querySelector('#shuffle-button') as HTMLImageElement;
	}

	async init() {
		await super.init();

		const setupTab = (element: HTMLImageElement, levels: Mission[]) => {
			element.addEventListener('mousedown', (e) => {
				if (e.button !== 0) return;
				mainAudioManager.play('buttonpress.wav');
			});
			element.addEventListener('click', (e) => e.button === 0 && this.setMissionArray(levels));
		};
		setupTab(this.tabBeginner, MissionLibrary.goldBeginner);
		setupTab(this.tabIntermediate, MissionLibrary.goldIntermediate);
		setupTab(this.tabAdvanced, MissionLibrary.goldAdvanced);
		setupTab(this.tabCustom, MissionLibrary.goldCustom);

		this.loadReplayButton.addEventListener('click', async (e) => {
			this.showLoadReplayPrompt(e);
		});
		this.loadReplayButton.addEventListener('mouseenter', () => {
			mainAudioManager.play('buttonover.wav');
		});
		this.loadReplayButton.addEventListener('mousedown', (e) => {
			if (e.button === 0) mainAudioManager.play('buttonpress.wav');
		});

		this.shuffleButton.addEventListener('click', () => {
			this.shuffle();
		});
		this.shuffleButton.addEventListener('mouseenter', () => {
			mainAudioManager.play('buttonover.wav');
		});
		this.shuffleButton.addEventListener('mousedown', (e) => {
			if (e.button === 0) mainAudioManager.play('buttonpress.wav');
		});

		// Preload images and leaderboards
		this.setMissionArray(MissionLibrary.goldCustom, false); // Make sure to disable the image timeouts so that no funky stuff happens
		this.setMissionArray(MissionLibrary.goldAdvanced, false);
		this.setMissionArray(MissionLibrary.goldIntermediate, false);
		this.setMissionArray(MissionLibrary.goldBeginner, false);
	}

	setMissionArray(arr: Mission[], doImageTimeout?: boolean) {
		super.setMissionArray(arr, doImageTimeout);

		for (let elem of [this.tabBeginner, this.tabIntermediate, this.tabAdvanced, this.tabCustom]) {
			elem.style.zIndex = "-1";
		}

		let index = [MissionLibrary.goldBeginner, MissionLibrary.goldIntermediate, MissionLibrary.goldAdvanced, MissionLibrary.goldCustom].indexOf(this.currentMissionArray);

		let elem = [this.tabBeginner, this.tabIntermediate, this.tabAdvanced, this.tabCustom][index];
		elem.style.zIndex = "0"; // Bring the tab to the front
	}

	displayMetadata() {
		let mission = this.currentMission;

		this.levelTitle.textContent = mission.title;
		this.levelArtist.textContent = 'by ' + mission.artist.trim();
		this.levelArtist.style.display = (mission.type === 'custom')? 'block' : 'none'; // Only show the artist for custom levels
		this.levelDescription.textContent = mission.description;
		let qualifyTime = (mission.qualifyTime !== 0)? mission.qualifyTime : Infinity;
		this.levelQualifyTime.textContent = isFinite(qualifyTime)? "Time to Qualify: " + Util.secondsToTimeString(qualifyTime / 1000) : '';
		this.levelNumberElement.textContent = `${Util.uppercaseFirstLetter(mission.type)} Level ${this.currentMissionIndex + 1}`;
	}

	displayEmptyMetadata() {
		this.levelTitle.innerHTML = '<br>';
		this.levelArtist.style.display = 'none';
		this.levelDescription.innerHTML = '<br>';
		this.levelQualifyTime.innerHTML = '';
		this.levelNumberElement.textContent = `Level ${this.currentMissionIndex + 1}`;
	}

	}