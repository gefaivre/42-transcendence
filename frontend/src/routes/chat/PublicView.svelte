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
      axios.post('http://localhost:3000/chat', {channelName: channelName});
    }
</script>

<div class="create-pannel">

  <div class="title">
    <h1>view all Channel</h1>
  </div>

  <div class="view">

    <ul>
      {#each channels as channel}
        <li>
        <p><span>{channel.name}</span><button on:click={() => joinChannel(channel.name)}>join</button></p>
        </li>
      {/each}
    </ul>

  </div>
  </div>

<style>

.create-pannel {
  background-color: var(--lite-grey);
  border-radius: 15px;
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
  border-radius: 15px 15px 0 0;

}

h1 {
    font-family: Courier, monospace;
    color: var(--orange);
}

 .view {
   height: 360px;
   overflow: auto;
 }

button {
  float: right;
  margin-right:5em;
  background-color:#3b82f6;
  font-size:0.8em;
  border: 1px solid #1d4ed8;
  border-radius:4px;
  color: var(--white);
}
span {
  float: left;
  margin-left:5em;
}


  li {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr;
    background-color: var(--li-one);
  }

  li:nth-child(2n + 1) {
    background-color: var(--li-two);
  }

 *::-webkit-scrollbar {
    display: none;
  }


</style>
