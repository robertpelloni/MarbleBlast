<script>
  export let alertState = { visible: false, heading: '', body: '', type: 'alert', modification: 'mbp', popupBackgroundSrc: '', popupOkaySrc: '', popupYesSrc: '', popupNoSrc: '', onConfirm: null, onCancel: null, customHtml: null };
  function handleOkay() { if (alertState.onConfirm) alertState.onConfirm(true); }
  function handleYes() { if (alertState.onConfirm) alertState.onConfirm(true); }
  function handleNo() { if (alertState.onCancel) alertState.onCancel(false); }
</script>

<style>
  .popup-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; z-index: 3000; }
  .popup { position: relative; color: white; font-family: sans-serif; }
  .popup ._heading { position: absolute; top: 10%; width: 100%; text-align: center; font-size: 24px; font-weight: bold; }
  .popup ._body { position: absolute; top: 30%; width: 80%; left: 10%; text-align: center; font-size: 16px; }
  .popup ._custom { position: absolute; width: 80%; left: 10%; }
  .btn-okay { position: absolute; bottom: 10%; left: 50%; transform: translateX(-50%); cursor: pointer; }
  .btn-no { position: absolute; bottom: 10%; left: 30%; transform: translateX(-50%); cursor: pointer; }
  .btn-yes { position: absolute; bottom: 10%; left: 70%; transform: translateX(-50%); cursor: pointer; }
</style>

{#if alertState.visible}
  <div class="popup-overlay">
    <div class="popup {alertState.modification}">
      <img src={alertState.popupBackgroundSrc} alt="Popup Background" />
      <p class="_heading">{alertState.heading}</p>
      <p class="_body">{@html alertState.body}</p>
      {#if alertState.customHtml}
        <div class="_custom">{@html alertState.customHtml.innerHTML}</div>
      {/if}
      {#if alertState.type === 'alert'}
        <img class="btn-okay" src={alertState.popupOkaySrc} alt="Okay" on:click={handleOkay} on:keydown={(e) => { if(e.key === 'Enter') handleOkay() }} tabindex="0" />
      {:else if alertState.type === 'confirm'}
        <img class="btn-no" src={alertState.popupNoSrc} alt="No" on:click={handleNo} on:keydown={(e) => { if(e.key === 'Enter') handleNo() }} tabindex="0" />
        <img class="btn-yes" src={alertState.popupYesSrc} alt="Yes" on:click={handleYes} on:keydown={(e) => { if(e.key === 'Enter') handleYes() }} tabindex="0" />
      {/if}
    </div>
  </div>
{/if}