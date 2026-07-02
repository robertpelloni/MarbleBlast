<script>
  import { onMount, createEventDispatcher } from 'svelte';

  export let StorageManager;
  export let modification = 'mbp';
  export let hideOptions;
  export let changeKeybinding;
  export let formatKeybinding;
  export let formatGamepadKeybindingForButton;

  const dispatch = createEventDispatcher();

  let settings = {};
  let activeTab = 'graphics'; // graphics, audio, controls, touch

  onMount(() => {
    if (StorageManager && StorageManager.data) {
      settings = StorageManager.data.settings;
    }
  });

  function updateSetting(key, value) {
    if (StorageManager && StorageManager.data) {
      StorageManager.data.settings[key] = value;
      settings = StorageManager.data.settings;
      StorageManager.store();
    }
  }

  const mbgBindings = [
    { label: 'Move Forward', key: 'up' },
    { label: 'Move Backward', key: 'down' },
    { label: 'Move Left', key: 'left' },
    { label: 'Move Right', key: 'right' },
    { label: 'Jump', key: 'jump' },
    { label: 'Use PowerUp', key: 'use' },
    { label: 'Camera Up', key: 'cameraUp' },
    { label: 'Camera Down', key: 'cameraDown' },
    { label: 'Camera Left', key: 'cameraLeft' },
    { label: 'Camera Right', key: 'cameraRight' },
    { label: 'Free Look', key: 'freeLook' }
  ];

  const mbpBindings = [
    ...mbgBindings,
    { label: 'Restart Level', key: 'restart' },
    { label: 'Alt. Use PowerUp', key: 'use2' },
    { label: 'Look Up', key: 'lookUp' },
    { label: 'Look Down', key: 'lookDown' }
  ];

  $: currentSettings = settings;
  $: bindings = modification === 'gold' ? mbgBindings.map(b => ({...b, trigger: currentSettings})) : mbpBindings.map(b => ({...b, trigger: currentSettings}));
  $: isMbp = modification === 'platinum';


  export let rebindState = {
    isRebinding: false,
    hasConflict: false,
    rebindText: '',
    conflictText: '',
    warningEnding: 'Rebind anyway?'
  };


  export let confirmRebind;
  export let declineRebind;
  export let onPickMarbleTexture;
  export let hasMarbleTexture = false;
  export let onClearMarbleTexture;
  export let onRefresh;


  export let visible = false;
</script>

<style>
  .options-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
  }

  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }

  .tab {
    padding: 10px 20px;
    background: #333;
    cursor: pointer;
    border-radius: 5px;
  }

  .tab.active {
    background: #007bff;
  }

  .content {
    background: rgba(50, 50, 50, 0.9);
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    height: 60%;
    overflow-y: auto;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #555;
  }

  .row:last-child {
    border-bottom: none;
  }

  .label {
    flex: 1;
    text-align: left;
    font-size: 16px;
  }

  .control {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  input[type="range"] {
    width: 150px;
    margin-right: 10px;
  }

  select {
    padding: 5px;
    background: #222;
    color: white;
    border: 1px solid #555;
    border-radius: 4px;
  }

  button {
    padding: 5px 15px;
    background: #444;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #555;
  }

  .home-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    cursor: pointer;
  }

  .modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 2000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
  }

  .confirm-buttons {
    display: flex;
    gap: 40px;
    margin-top: 20px;
  }

  .confirm-buttons img {
    cursor: pointer;
  }
</style>

{#if visible}
<div class="options-container" role="dialog" aria-modal="true">
  <h2>Options</h2>

  <img src="./assets/ui/play/prev.png" alt="Home" class="home-btn" on:click={hideOptions} />

  <div class="tabs">
    <div class="tab" class:active={activeTab === 'graphics'} on:click={() => activeTab = 'graphics'}    on:keydown={(e) => { if (e.key === 'Enter') activeTab = 'graphics' }}>Graphics</div>
    <div class="tab" class:active={activeTab === 'audio'} on:click={() => activeTab = 'audio'}    on:keydown={(e) => { if (e.key === 'Enter') activeTab = 'audio' }}>Audio</div>
    <div class="tab" class:active={activeTab === 'controls'} on:click={() => activeTab = 'controls'}    on:keydown={(e) => { if (e.key === 'Enter') activeTab = 'controls' }}>Controls</div>
    {#if isMbp || settings.touchControls}
      <div class="tab" class:active={activeTab === 'touch'} on:click={() => activeTab = 'touch'}    on:keydown={(e) => { if (e.key === 'Enter') activeTab = 'touch' }}>Touch</div>

      <div class="row">
        <div class="label">Button Order</div>
        <div class="control">
          <select value={settings.actionButtonOrder} on:change={(e) => updateSetting('actionButtonOrder', parseInt(e.currentTarget.value))}>
            <option value="0">Blast - Jump - Use</option>
            <option value="1">Blast - Use - Jump</option>
            <option value="2">Jump - Blast - Use</option>
            <option value="3">Jump - Use - Blast</option>
            <option value="4">Use - Blast - Jump</option>
            <option value="5">Use - Jump - Blast</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="label">Button Size</div>
        <div class="control">
          <input type="range" min="50" max="300" value={settings.actionButtonSize || 100} on:input={(e) => updateSetting('actionButtonSize', parseFloat(e.currentTarget.value))} />
        </div>
      </div>
      <div class="row">
        <div class="label">Button Right Offset</div>
        <div class="control">
          <input type="range" min="0" max="300" value={settings.actionButtonRightOffset || 15} on:input={(e) => updateSetting('actionButtonRightOffset', parseFloat(e.currentTarget.value))} />
        </div>
      </div>
      <div class="row">
        <div class="label">Button Bottom Offset</div>
        <div class="control">
          <input type="range" min="0" max="300" value={settings.actionButtonBottomOffset || 15} on:input={(e) => updateSetting('actionButtonBottomOffset', parseFloat(e.currentTarget.value))} />
        </div>
      </div>
      <div class="row">
        <div class="label">Button Sens. Fac.</div>
        <div class="control">
          <input type="range" min="0" max="3" step="0.1" value={settings.actionButtonAsJoystickMultiplier || 0} on:input={(e) => updateSetting('actionButtonAsJoystickMultiplier', parseFloat(e.currentTarget.value))} />
        </div>
      </div>

    {/if}
  </div>

  <div class="content">
    {#if activeTab === 'graphics'}
      <div class="row">
        <div class="label">Field of View</div>
        <div class="control">
          <input type="range" min="30" max="120" value={settings.fov || 90} on:input={(e) => updateSetting('fov', parseFloat(e.currentTarget.value))} />
          <span>{settings.fov || 90}</span>
        </div>
      </div>
      <div class="row">
        <div class="label">Resolution Scale</div>
        <div class="control">
          <input type="range" min="0.1" max="1" step="0.1" value={settings.resolutionScale || 1} on:input={(e) => updateSetting('resolutionScale', parseFloat(e.currentTarget.value))} />
          <span>{settings.resolutionScale || 1}</span>
        </div>
      </div>

      {#if isMbp}
        <div class="row">
          <div class="label">Reflective Marble</div>
          <div class="control">
            <select value={settings.marbleReflectivity} on:change={(e) => updateSetting('marbleReflectivity', parseInt(e.currentTarget.value))}>
              <option value="0">Contextual</option>
              <option value="1">Disabled</option>
              <option value="2">Enabled</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="label">Pixel Ratio</div>
          <div class="control">
            <select value={settings.pixelRatio} on:change={(e) => updateSetting('pixelRatio', parseInt(e.currentTarget.value))}>
              <option value="0">Max 0.5</option>
              <option value="1">Max 1.0</option>
              <option value="2">Max 1.5</option>
              <option value="3">Max 2.0</option>
              <option value="4">Max ∞</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="label">Low-latency mode</div>
          <div class="control">
            <input type="checkbox" checked={settings.canvasDesynchronized} on:change={(e) => { updateSetting('canvasDesynchronized', e.currentTarget.checked); onRefresh(); }} />
          </div>
        </div>
        <div class="row">
          <div class="label">Frame Rate Cap</div>
          <div class="control">
            <select value={settings.frameRateCap} on:change={(e) => updateSetting('frameRateCap', parseInt(e.currentTarget.value))}>
              <option value="0">30</option>
              <option value="1">60</option>
              <option value="2">90</option>
              <option value="3">120</option>
              <option value="4">144</option>
              <option value="5">165</option>
              <option value="6">240</option>
              <option value="7">360</option>
              <option value="8">Unlimited</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="label">Show Frame Rate</div>
          <div class="control">
            <input type="checkbox" checked={settings.showFrameRate} on:change={(e) => updateSetting('showFrameRate', e.currentTarget.checked)} />
          </div>
        </div>
        <div class="row">
          <div class="label">Thousandths</div>
          <div class="control">
            <input type="checkbox" checked={settings.showThousandths} on:change={(e) => updateSetting('showThousandths', e.currentTarget.checked)} />
          </div>
        </div>
        <div class="row">
          <div class="label">Custom Marble</div>
          <div class="control">
            {#if hasMarbleTexture}
              <button on:click={onClearMarbleTexture} style="background: darkred; margin-right: 5px;">Clear</button>
            {/if}
            <button on:click={onPickMarbleTexture}>Select File</button>
          </div>
        </div>
      {/if}

    {:else if activeTab === 'audio'}
      <div class="row">
        <div class="label">Music Volume</div>
        <div class="control">
          <input type="range" min="0" max="1" step="0.01" value={settings.musicVolume ?? 0.5} on:input={(e) => { updateSetting('musicVolume', parseFloat(e.currentTarget.value)); dispatch('audioUpdate'); }} />
          <span>{Math.floor((settings.musicVolume ?? 0.5) * 100)}%</span>
        </div>
      </div>
      <div class="row">
        <div class="label">Sound Volume</div>
        <div class="control">
          <input type="range" min="0" max="1" step="0.01" value={settings.soundVolume ?? 0.7} on:input={(e) => { updateSetting('soundVolume', parseFloat(e.currentTarget.value)); dispatch('audioUpdate'); }} />
          <span>{Math.floor((settings.soundVolume ?? 0.7) * 100)}%</span>
        </div>
      </div>

    {:else if activeTab === 'controls'}
      <div class="row">
        <div class="label">Mouse Sensitivity</div>
        <div class="control">
          <input type="range" min="0.01" max="1" step="0.01" value={settings.mouseSensitivity ?? 0.25} on:input={(e) => updateSetting('mouseSensitivity', parseFloat(e.currentTarget.value))} />
          <span>{Math.floor((settings.mouseSensitivity ?? 0.25) * 100)}%</span>
        </div>
      </div>

      <div class="row">
        <div class="label">Always Free-Look</div>
        <div class="control">
          <input type="checkbox" checked={settings.alwaysFreeLook} on:change={(e) => updateSetting('alwaysFreeLook', e.currentTarget.checked)} />
        </div>
      </div>
      <div class="row">
        <div class="label">Keyboard Speed</div>
        <div class="control">
          <input type="range" min="0" max="1" step="0.01" value={settings.keyboardSensitivity ?? 1.0} on:input={(e) => updateSetting('keyboardSensitivity', parseFloat(e.currentTarget.value))} />
        </div>
      </div>
      <div class="row">
        <div class="label">Input Type</div>
        <div class="control">
          <select value={settings.inputType} on:change={(e) => { updateSetting('inputType', parseInt(e.currentTarget.value)); onRefresh(); }}>
            <option value="0">Auto</option>
            <option value="1">Keyboard + Mouse</option>
            <option value="2">Touch</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="label">Invert Y-Axis</div>
        <div class="control">
          <input type="checkbox" checked={settings.invertYAxis} on:change={(e) => updateSetting('invertYAxis', e.currentTarget.checked)} />
        </div>
      </div>

      <h3 style="margin-top: 20px; border-bottom: 1px solid #777; padding-bottom: 5px;">Keybindings</h3>
      {#each bindings as bind}
        <div class="row">
          <div class="label">{bind.label}</div>
          <div class="control" style="gap: 10px;">
            <button on:click={() => changeKeybinding(bind.key, false)}>{formatKeybinding(bind.key)}</button>
            <button on:click={() => changeKeybinding(bind.key, true)}>Gamepad: {formatGamepadKeybindingForButton(bind.key)}</button>
          </div>
        </div>
      {/each}

    {:else if activeTab === 'touch'}
      <div class="row" title="Fixed locks the joystick to a specific spot. Dynamic spawns the joystick wherever you touch.">
        <div class="label">Joystick Mode</div>
        <div class="control">
          <select value={settings.joystickPosition} on:change={(e) => updateSetting('joystickPosition', parseInt(e.currentTarget.value))}>
            <option value="0">Fixed</option>
            <option value="1">Dynamic</option>
          </select>
        </div>
      </div>
      <div class="row">
        <div class="label">Joystick Size</div>
        <div class="control">
          <input type="range" min="100" max="500" value={settings.joystickSize || 200} on:input={(e) => updateSetting('joystickSize', parseFloat(e.currentTarget.value))} />
          <span>{settings.joystickSize || 200}</span>
        </div>
      </div>
      <div class="row">
        <div class="label">Joystick X Offset</div>
        <div class="control">
          <input type="range" min="0" max="300" value={settings.joystickLeftOffset || 75} on:input={(e) => updateSetting('joystickLeftOffset', parseFloat(e.currentTarget.value))} />
        </div>
      </div>
      <div class="row">
        <div class="label">Joystick Y Pos</div>
        <div class="control">
          <input type="range" min="0" max="1" step="0.05" value={settings.joystickVerticalPosition || 0.5} on:input={(e) => updateSetting('joystickVerticalPosition', parseFloat(e.currentTarget.value))} />
        </div>
      </div>
    {/if}
  </div>
</div>


{#if rebindState.isRebinding && !rebindState.hasConflict}
  <div class="modal-overlay">
    <h2>{rebindState.rebindText}</h2>
    <p>Press ESC to cancel.</p>
  </div>
{/if}

{#if rebindState.hasConflict}
  <div class="modal-overlay">
    <h2>{@html rebindState.conflictText}</h2>
    <div class="confirm-buttons">
      <img src="./assets/ui/options/yes.png" alt="Yes"    on:click={confirmRebind} on:keydown={(e) => { if(e.key === 'Enter') confirmRebind() }} />
      <img src="./assets/ui/options/no.png" alt="No"    on:click={declineRebind} on:keydown={(e) => { if(e.key === 'Enter') declineRebind() }} />
    </div>
  </div>
{/if}



{/if}
