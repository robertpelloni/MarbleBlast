<script>
  import { onMount, createEventDispatcher } from 'svelte';

  export let StorageManager;
  export let state;
  export let MisParser;
  export let Mission;
  export let MissionLibrary;
  export let hideEditor;
  export let serializeMission;

  let savedLevels = [];
  let selectedLevel = "";

  const dispatch = createEventDispatcher();

  async function loadLevels() {
    let keys = await StorageManager.databaseGetAllKeys('keyvalue');
    savedLevels = keys.filter(k => typeof k === 'string' && k.startsWith('editorLevel_'));
  }

  onMount(() => {
    loadLevels();
  });

  async function loadSelectedLevel() {
    if (selectedLevel) {
      let misStr = await StorageManager.databaseGet('keyvalue', selectedLevel);
      if (misStr) {
        try {
          let misFile = new MisParser(misStr).parse();
          let newMission = Mission.fromMisFile('custom/editor/' + selectedLevel, misFile);
          MissionLibrary.allMissions.push(newMission);
          alert("Loaded mission!");
        } catch(e) {
          alert("Failed to parse mission");
        }
      }
    }
  }

  async function saveNewLevel() {
    let name = prompt("Enter level name:");
    if (name) {
      let misStr = serializeMission();
      await StorageManager.databasePut('keyvalue', misStr, 'editorLevel_' + name);
      loadLevels();
      alert("Saved level to local storage!");
    }
  }

  function importAsset() {
    let fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('accept', ".dts,.dif,.ogg,.wav,.jpg,.png,.jpeg");

    fileInput.onchange = async () => {
      let file = fileInput.files[0];
      if (!file) return;

      let logicalPath = prompt("Enter the logical path for this asset (e.g. data/shapes/custom/my_shape.dts):", "data/custom/" + file.name);
      if (!logicalPath) return;

      await StorageManager.databasePut('keyvalue', file, 'custom_asset_' + logicalPath);
      alert("Successfully imported " + file.name + " as " + logicalPath);
    };
    fileInput.click();
  }

  async function placeShape() {
    let path = prompt("Enter shape path (e.g. data/shapes/items/gem.dts):");
    if (!path) return;
    if (!state.level) {
      state.menu.showAlertPopup("Editor Error", "You must be in a level to place shapes!");
      return;
    }

    let pos = state.level.marble.group.position.clone();
    pos.z += 2;

    let fakeElement = {
      _type: 'TSStatic',
      _name: 'CustomShape',
      _id: Math.floor(Math.random() * 100000),
      position: pos.x + ' ' + pos.y + ' ' + pos.z,
      rotation: '1 0 0 0',
      scale: '1 1 1',
      shapename: '~/data/' + path
    };

    try {
      await state.level.addTSStatic(fakeElement);
      state.menu.showAlertPopup("Success", "Spawned shape " + path + " at " + pos.toArray().map(x => x.toFixed(2)).join(', '));
    } catch(e) {
      state.menu.showAlertPopup("Editor Error", "Failed to spawn shape! Ensure the asset is cached or valid.");
    }
  }

  function exportMis() {
    let misContent = serializeMission();
    const blob = new Blob([misContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom_level.mis';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

</script>

<style>
  .editor-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-family: sans-serif;
  }
  .header {
    text-align: center;
  }
  .home-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
  }
  .tools-panel {
    position: absolute;
    right: 20px;
    top: 100px;
    width: 300px;
    background-color: rgba(50, 50, 50, 0.9);
    padding: 10px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .toolbar {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
  }
</style>

<div class="editor-container" on:click={() => dispatch('clickRaycast')} role="button" tabindex="0" on:keydown={(e) => { if(e.key === 'Enter') dispatch('clickRaycast') }}>
  <h1 class="header">Level Editor (WIP)</h1>

  <img src="./assets/ui/play/prev.png" alt="Home" class="home-btn" on:click={hideEditor} role="button" tabindex="0" on:keydown={(e) => { if(e.key === 'Enter') hideEditor() }} />

  <div class="tools-panel" on:click|stopPropagation role="region" tabindex="-1">
    <h3>Saved Levels</h3>
    <select bind:value={selectedLevel} size="5">
      {#each savedLevels as level}
        <option value={level}>{level.replace('editorLevel_', '')}</option>
      {/each}
    </select>

    <button on:click={loadSelectedLevel}>Load Selected</button>
    <button on:click={saveNewLevel}>Save New Level</button>
    <button on:click={importAsset}>Import Custom Asset</button>
  </div>

  <div class="toolbar" on:click|stopPropagation role="region" tabindex="-1">
    <button on:click={placeShape}>Place Shape (.dts)</button>
    <button on:click={exportMis}>Export .mis</button>
  </div>
</div>
