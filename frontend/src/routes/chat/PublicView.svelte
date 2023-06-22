<script lang="ts">
    import axios from "../../axios.config";
    import { onMount } from "svelte";
    import type { Channel} from "../../types";



    let channels: Channel[] = [];

    onMount(() => getAll())

    async function getAll() {
      try {
        channels = (await axios.get('/channel')).data
        console.log(channels)
      } catch (e) {
        console.log(e.response.data.message)
      }
    }

    async function joinChannel(channelName: string) {
      try {
        await axios.patch(`http://localhost:3000/channel/join/${channelName}`)
      } catch(e) {
        console.log(e)
      }
    }
</script>

<div class="create-pannel">

  <div class="title">
    <h1>All channels</h1>
  </div>

  <div class="view">

    <ul>
      {#each channels as channel}
        <li>
        <p><span>{channel.name}</span><button class="btn btn-sm" on:click={() => joinChannel(channel.name)}>join</button></p>
        </li>
      {/each}
    </ul>

  </div>
  </div>

<style>

.create-pannel {
  background-color: var(--lite-grey);
  border-radius: var(--panel-radius);
  display: grid;
  grid-template-rows: auto 1fr;
  height: var(--panel-height);
  width: var(--panel-width);
}

.title {
  display: flex;
  height: 40px;
  background-color: var(--grey);
  justify-content: center;
  align-items: center;
  border-radius: var(--panel-radius) var(--panel-radius) 0 0;

}

h1 {
    font-family: Courier, monospace;
    color: var(--orange);
    font-weight:bold;
    font-size:1.2em;
}

 .view {
   height: 360px;
   overflow: auto;
 }

button {
  float: right;
  margin-right: 5em;
}

span {
  float: left;
  margin-left:5em;
}


  li {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr;
    padding-top: 0.2em; 
    color: var(--lite-lite-grey);
    font-weight:bold;
    background-color: var(--li-one);
  }

  li:nth-child(2n + 1) {
    background-color: var(--li-two);
  }

 *::-webkit-scrollbar {
    display: none;
  }


</style>
