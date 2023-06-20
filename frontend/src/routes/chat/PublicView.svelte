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
</script>

<div class="create-pannel">

  <div class="title">
    <h1>view all Channel</h1>
  </div>

  <div class="view">

    <ul>
      {#each channels as channel}
        <li>
          <a contenteditable="false" bind:innerHTML={channel.name} href="#/chat/channel/{channel.name}">{channel.name}</a>
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
  height: 400px;
  width: 550px;
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

 li {
    display: block;
  }


  li {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr;
    background-color: var(--lite-lite-lite-grey);
  }

  li:nth-child(2n + 1) {
    background-color: var(--lite-lite-grey);
  }

 *::-webkit-scrollbar {
    display: none;
  }


</style>