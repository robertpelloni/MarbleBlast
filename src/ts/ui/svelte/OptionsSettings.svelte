<script>
  import { onMount } from 'svelte';

  export let StorageManager;

  let settings = {};

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
</script>

<style>
  .settings-panel {
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 20px;
    border-radius: 8px;
    font-family: sans-serif;
  }
  .setting-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  .setting-label {
    flex: 1;
    text-align: left;
  }
  .setting-control {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }
</style>

<div class="settings-panel">
  <h3>Settings Prototype (Svelte)</h3>
  <div class="setting-row">
    <div class="setting-label">Field of View</div>
    <div class="setting-control">
      <input
        type="range"
        min="30"
        max="120"
        value={settings.fov || 90}
        on:input={(e) => updateSetting('fov', parseFloat(e.currentTarget.value))}
      />
      <span style="margin-left: 10px; width: 30px;">{settings.fov || 90}</span>
    </div>
  </div>

  <div class="setting-row">
    <div class="setting-label">Fancy Shaders</div>
    <div class="setting-control">
      <input
        type="checkbox"
        checked={settings.fancyShaders}
        on:change={(e) => updateSetting('fancyShaders', e.currentTarget.checked)}
      />
    </div>
  </div>
</div>
