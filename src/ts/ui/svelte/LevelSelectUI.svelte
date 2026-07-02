<script>
  export let scores = [];
  export let modification = 'mbp';
  export let goldTime = 0;
  export let ultimateTime = Infinity;
  export let handleReplayPlay = () => {};

  function formatTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let millis = Math.floor(ms % 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  }

  function getScoreColor(scoreTime) {
    if (modification === 'gold') return '';
    if (scoreTime <= ultimateTime) return '#ffaa00'; // ultimate
    if (scoreTime <= goldTime) return '#dddddd'; // platinum
    return '';
  }
</script>

<style>
  .score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 5px;
    font-family: monospace;
    font-size: 14px;
    color: white;
  }

  .score-item .name {
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .score-item .time {
    margin-right: 10px;
  }

  .score-item img {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }

  .score-item.mbg img.gold {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
</style>

{#each scores as score, index}
  <div class="score-item {modification}" style="color: {getScoreColor(score[1])}">
    <div class="name">
      <span>{index + 1}.</span> {score[0]}
    </div>

    {#if modification === 'gold'}
      <img class="gold" src="./assets/ui/play/goldscore.png" alt="Gold" style="opacity: {score[1] <= goldTime ? 1 : 0}" />
    {/if}

    <div class="time">{formatTime(score[1])}</div>

    {#if score[2]}
      <!-- Replay button -->
      <img
        src="./assets/ui/{modification === 'gold' ? 'play' : 'play'}/replay.png"
        alt="Replay"
        on:click={() => handleReplayPlay(score[2])}
        title="Play Replay"
      />
    {/if}
  </div>
{/each}
