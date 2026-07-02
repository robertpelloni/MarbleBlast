<script>
  export let pages = [];
  export let selectedIndex = 0;

  export let onSelectPage;
  export let visible = true;
</script>

<style>
  .help-container {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.8);
    color: white;
    font-family: sans-serif;
  }

  .sidebar {
    width: 200px;
    background: #333;
    overflow-y: auto;
    padding: 10px;
  }

  .page-link {
    padding: 5px;
    cursor: pointer;
    border-bottom: 1px solid #444;
  }

  .page-link:hover {
    background: #444;
  }

  .page-link.selected {
    background: #007bff;
  }

  .content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
</style>

{#if visible}
<div class="help-container">
  <div class="sidebar">
    {#each pages as page, i}
      <div class="page-link" class:selected={selectedIndex === i} on:click={() => onSelectPage(i)}>
        {page.title}
      </div>
    {/each}
  </div>

  <div class="content">
    {#if pages[selectedIndex]}
      {@html pages[selectedIndex].html}
    {/if}
  </div>
</div>

{/if}
