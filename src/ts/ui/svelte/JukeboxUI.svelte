<script>
  export let songs = {};
  export let selectedIndex = null;
  export let playing = true;
  export let visible = false;
  export let onSelectSong;
  export let onTogglePlay;
  export let onNext;
  export let onPrev;
  export let onClose;
  $: songKeys = Object.keys(songs);
  $: currentSongName = selectedIndex !== null ? songs[songKeys[selectedIndex]] : '';
</script>

<style>
  .jukebox-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.9); border: 2px solid #555; padding: 20px; color: white; font-family: sans-serif; z-index: 2000; width: 300px; }
  .songs-container { height: 150px; overflow-y: auto; border: 1px solid #777; margin-bottom: 10px; padding: 5px; }
  .song-item { cursor: pointer; padding: 3px; }
  .song-item:hover { background-color: #333; }
  .song-item.selected { background-color: #007bff; }
  .controls { display: flex; justify-content: space-around; align-items: center; margin-top: 10px; }
  .controls img { cursor: pointer; }
</style>

{#if visible}
  <div class="jukebox-overlay">
    <div class="songs-container">
      {#each songKeys as key, i}
        <div class="song-item" class:selected={selectedIndex === i} on:click={() => onSelectSong(key)} on:keydown={(e) => { if(e.key === 'Enter') onSelectSong(key) }} tabindex="0">
          {songs[key]}
        </div>
      {/each}
    </div>
    <p>
      {#if selectedIndex !== null}
        Title: {currentSongName}<br>
        {playing ? 'Playing' : 'Stopped'}
      {/if}
    </p>
    <div class="controls">
      <img src="./assets/ui_mbp/play/prev_{selectedIndex === null || selectedIndex === 0 ? 'i' : 'n'}.png" alt="Prev" on:click={onPrev} on:keydown={(e) => { if(e.key === 'Enter') onPrev() }} tabindex="0" />
      <img src="./assets/ui_mbp/jukebox/{playing ? 'stop' : 'play'}.png" alt="Play/Stop" on:click={onTogglePlay} on:keydown={(e) => { if(e.key === 'Enter') onTogglePlay() }} tabindex="0" />
      <img src="./assets/ui_mbp/play/next_{selectedIndex === null || selectedIndex === songKeys.length - 1 ? 'i' : 'n'}.png" alt="Next" on:click={onNext} on:keydown={(e) => { if(e.key === 'Enter') onNext() }} tabindex="0" />
      <img src="./assets/ui_mbp/jukebox/close_n.png" alt="Close" on:click={onClose} on:keydown={(e) => { if(e.key === 'Enter') onClose() }} tabindex="0" />
    </div>
  </div>
{/if}