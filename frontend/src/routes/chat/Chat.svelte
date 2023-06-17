<script lang="ts">
  import axios from "../../axios.config";
  import type { User } from "../../types";
  import ChatPanel from "./ChatPanel.svelte";
  import { onMount } from "svelte";
  import PublicView from "./PublicView.svelte";
  import Create from "./Create.svelte";
  import DirectMessage from "./DirectMessage.svelte";
  import Channel from "./Channel.svelte";

  export let params: any = [];
  let user: User;

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

</script>

  <div class="component">

    <DirectMessage bind:user/>

    <Channel/>

    <Create/>

    <PublicView/>

  </div>

<style>

  .component {
    height: 100%;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-auto-rows: 500px;
    grid-auto-columns: 500px;
    overflow-y: scroll;
  }

  @media screen and (max-width: 1300px) {
    .component {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }
  }


</style>