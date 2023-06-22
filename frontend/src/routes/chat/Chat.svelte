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
  
  <h1>Chat</h1>

  <div class="component">

    <DirectMessage bind:user/>

    <Channel/>

    <Create/>

    <PublicView/>

  </div>

<style>

  h1 {
    margin-top:1em;
    text-shadow:  0 0 10px ;
    color: var(--pink);
    font-size: 2em;
    font-weight: bold;
    margin-bottom:2em;
    text-align: center;
  }

  .component {
    height: 75%;
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
