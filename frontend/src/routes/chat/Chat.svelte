<script lang="ts">
    import axios from "../../axios.config";
    import type { User } from "../../types";
    import ChatPanel from "./ChatPanel.svelte";
    import { onMount } from "svelte";
    import PublicView from "./PublicView.svelte";
    import Discuss from "./Discuss.svelte";
    import Create from "./Create.svelte";
    import DirectMessage from "./DirectMessage.svelte";
    import Channel from "./Channel.svelte";

  let user: User;

  export let params: any = [];


  onMount(() => getProfile())

  async function getProfile() {
    console.log(params)
    try {
      const response = await axios.get('/auth/whoami')
      user = response.data;
    }
    catch (e) {
    }
  }

  // DM
  // Channels
  // Create channels
  // All

</script>



  <div class="component">


    <DirectMessage bind:user/>

    <!--  <Channel bind:params />

   <Create bind:user/>

    <PublicView/> -->

  </div>




<style>

  .component {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    background-color: var(--black);
  }

</style>