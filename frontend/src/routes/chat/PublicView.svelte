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

  <h1>view all Channel</h1>

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
  border: solid 1px black;
  border-radius: 40px;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 80%;
  width: 80%;
}

h1 {
  height: 35px;
  text-align: center;
}

 .view {
   display: flex;
   justify-content: center;
   align-items: center;
 }


</style>