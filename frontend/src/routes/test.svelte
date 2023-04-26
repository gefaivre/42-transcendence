<script lang="ts">
	import { afterUpdate, tick } from 'svelte';
	
	let list = [];
	let element;
	
	// Either afterUpdate()
	afterUpdate(() => {
		console.log("afterUpdate");
		if(list) scrollToBottom(element);
  });
	
	$: if(list && element) {
		console.log("tick");
		scrollToBottom(element);
	}

  const scrollToBottom = async (node) => {
    node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  }; 
	
	function addName() {
		list.push("Name");
		list=list;
	}
</script>

<div bind:this={element} style="height:250px;overflow:auto;">
	{#each list as name}
    <h1>Hello {name}!</h1>
  {/each}
</div>

<button on:click={addName}>Add name</button>