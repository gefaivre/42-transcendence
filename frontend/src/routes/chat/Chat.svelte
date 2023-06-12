<script lang="ts">
    import ChatPanel from "./ChatPanel.svelte";


</script>

  <div class="component">

    <ChatPanel />

    <div class="second-panel">
       ouais
    </div>
  </div>


<style>

  .component {
    height: 100%;
    display: grid;
    grid-template-columns: 320px 1fr;
    background-color: var(--black);
  }

  .second-panel {
    grid-column: 2 / 3;
    background-color: var(--grey);
    overflow-y: auto;
  }

</style>