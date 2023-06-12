<script lang="ts">
    import { onMount } from "svelte";
    import DirectMessage from "./DirectMessage.svelte";
    import Channel from "./Channel.svelte";

    export let params: any = {}

    onMount(() => console.log(params))

</script>

  {#if params.type == "dm"}
    <DirectMessage bind:params />
  {:else if params.type == "channel"}
    <Channel bind:params />
  {:else}
    dommage
  {/if}

<style>

</style>