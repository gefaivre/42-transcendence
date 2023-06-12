<script lang="ts">
    import axios from "../../axios.config";
    import type { User } from "../../types";
    import ChatPanel from "./ChatPanel.svelte";
    import { onMount } from "svelte";
    import PublicView from "./PublicView.svelte";
    import Discuss from "./Discuss.svelte";

  let user: User;
  export let params;

  onMount(() => getProfile())

  async function getProfile() {
    try {
      const response = await axios.get('/auth/whoami')
      user = response.data;
    }
    catch (e) {
    }
  }

</script>

  <div class="component">

    <ChatPanel />
    <!-- bind:user -->

    <div class="second-panel">
      {#if params.name === null}
        <PublicView/>
      {:else}
        <Discuss/>
      {/if}
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