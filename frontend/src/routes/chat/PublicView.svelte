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


<h1>PUBLIC CHAN</h1>

<ul>
  {#each channels as channel}
    <li>
      <a contenteditable="false" bind:innerHTML={channel.name} href="#/chat/channel/{channel.name}">{channel.name}</a>
    </li>
  {/each}
</ul>




<style>

</style>