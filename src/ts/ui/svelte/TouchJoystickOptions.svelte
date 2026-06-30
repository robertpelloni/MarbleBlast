<script lang="ts">
  import { onMount } from 'svelte';

  // Create a prop for the StorageManager instance or just access global
  export let storageManager: any;

  let joystickSize = 250;

  onMount(() => {
    if (storageManager && storageManager.data && storageManager.data.settings) {
      joystickSize = storageManager.data.settings.joystickSize || 250;
    }
  });

  function handleSizeChange(event: Event) {
    const target = event.target as HTMLInputElement;
    joystickSize = parseFloat(target.value);
    if (storageManager && storageManager.data && storageManager.data.settings) {
      storageManager.data.settings.joystickSize = joystickSize;
      storageManager.store();
    }
  }
</script>

<style>
  .touch-options-container {
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
    margin-bottom: 15px;
  }

  .slider-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .slider-label {
    width: 150px;
    color: white;
    font-family: sans-serif;
  }

  .slider-value {
    width: 50px;
    color: white;
    font-family: sans-serif;
    text-align: right;
    margin-left: 10px;
  }

  input[type="range"] {
    flex: 1;
  }
</style>

<div class="touch-options-container">
  <div class="slider-row">
    <div class="slider-label">Touch Joystick Size:</div>
    <input
      type="range"
      min="100"
      max="500"
      step="10"
      bind:value={joystickSize}
      on:input={handleSizeChange}
    />
    <div class="slider-value">{joystickSize}px</div>
  </div>
</div>
