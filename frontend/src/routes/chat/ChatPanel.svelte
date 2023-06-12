<script lang="ts">
    import { onMount } from "svelte";
    import type { Channel, User } from "../../types";
    import axios from "../../axios.config";


    // export let user: User;
    export let create:boolean;
    let channels: string[] = [];
    let dms: string[] = [];


  onMount(() => getAll())

  async function getAll() {
    try {
      let response = await axios.get('/users/me/dm');
      dms = response.data;
      response = await axios.get('/users/me/channel');
      channels = response.data;
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

</script>

  <div class="chat-panel">
    <div class="ctn-title">
      <h1 class="title">Chat</h1>
    </div>

    <div class="create-button">
      <button on:click={() => (create = !create)}>New</button>
    </div>

    <div class="chat-list">
      <h2> Channel </h2>
        <ul>
          {#each channels as channel}
          <li>
            <a href="#/chat/channel/{channel}">{channel}</a>
          </li>
          {/each}
        </ul>
      <h2> Dm </h2>
      <ul>
        {#each dms as dm}
        <li>
          <a href="#/chat/dm/{dm}">{dm}</a>
        </li>
        {/each}
      </ul>
    </div>

  </div>


<style>

  h2 {
    font-size: 2em;
  }

  .create-button{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    border: solid 1px black;
    border-radius: 5px;
    background-color: azure;
    color: black;
    padding: 3px;
  }

  .chat-panel {
    height: 100%;
    display: grid;
    grid-template-rows: 100px 40px 1fr;
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