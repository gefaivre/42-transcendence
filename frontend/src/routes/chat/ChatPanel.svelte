<script lang="ts">
    import { onMount } from "svelte";
    import type { Channel, User } from "../../types";
    import axios from "../../axios.config";


    // export let user: User;
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
      <a href="#/chat" class="title">Chat</a>
    </div>

    <div class="create-button">
      <a class="button" href="#/chat/new">New</a>
    </div>

    <div class="chat-list">

      <div class="ctn-title">
        <h2> Channel </h2>
      </div>
        <ul>
          {#each channels as channel}
          <li >
            <div class="name">
              <a href="#/chat/channel/{channel}">{channel}</a>
            </div>
            <div class="action">
              A
            </div>
          </li>
          {/each}
        </ul>
      <div class="ctn-title">
        <h2> Dm </h2>
      </div>
      <ul>
        {#each dms as dm}
        <li >
          <div class="name">
            <a href="#/chat/dm/{dm}">{dm}</a>
          </div>
          <div class="action">
            A
          </div>
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

  .button {
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

  li {
    height: 40px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    background-color: var(--lite-lite-lite-grey);
    color: black;
  }
  
  li:nth-child(2n + 1) {
    background-color: var(--lite-lite-grey);
  }

  .name {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5%;
  }


</style>