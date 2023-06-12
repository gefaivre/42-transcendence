<script lang="ts">

</script>

  <div class="chat-panel">
    <div class="ctn-title">
      <h1 class="title">Chat</h1>
    </div>

  </div>


<style>

  .chat-panel {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 2fr 3fr;
    background-color: var(--grey);
    border-left: solid 1px var(--lite-grey);
    border-right: solid 1px var(--lite-grey);
  }

  .ctn-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: "Courier New", Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
  }

</style>