<script>
  export let scores = [];
  export let modification = 'mbp';
  export let goldTime = -Infinity;
  export let ultimateTime = -Infinity;

  function formatTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let millis = Math.floor(ms % 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
  }

  function getScoreColor(scoreTime) {
    if (modification === 'gold') {
      if (scoreTime <= goldTime && goldTime !== -Infinity) return '#fff700';
      return '';
    } else {
      if (scoreTime <= ultimateTime && ultimateTime !== -Infinity) return '#ffaa00'; // ultimate
      if (scoreTime <= goldTime && goldTime !== -Infinity) return '#dddddd'; // platinum
      return '';
    }
  }

  function getScoreShadow(scoreTime) {
    if (modification === 'gold') {
      if (scoreTime <= goldTime && goldTime !== -Infinity) return '1px 1px 0px black';
      return '';
    }
    return '';
  }
</script>

<style>
  .finish-row {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2px;
  }

  .finish-row p {
    margin: 0;
  }

  .finish-row.mbp {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
    font-weight: bold;
    font-style: italic;
    color: white;
  }

  .finish-row.mbg {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    color: white;
  }

  .time {
    font-family: "Courier New", Courier, monospace;
  }
</style>

{#each scores as score, index}
  <div class="finish-row {modification}">
    {#if modification === 'gold'}
      <p>{index + 1}. {score[0]}</p>
      <p class="time" style="color: {getScoreColor(score[1])}; text-shadow: {getScoreShadow(score[1])};">
        {formatTime(score[1])}
      </p>
    {:else}
      <p><span>{index + 1}.</span> {score[0]}</p>
      <p class="time" style="color: {getScoreColor(score[1])}">
        {formatTime(score[1])}
      </p>
    {/if}
  </div>
{/each}
