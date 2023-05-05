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
    const adminButton = document.getElementById('admin-button');
    const memberButton = document.getElementById('member-button');
    const cardContent = document.getElementById('card-content');

    adminButton.addEventListener('click', () => {
    adminButton.classList.add('active');
    memberButton.classList.remove('active');
    cardContent.textContent = 'Admin in the card.';
    });

    memberButton.addEventListener('click', () => {
    memberButton.classList.add('active');
    adminButton.classList.remove('active');
    cardContent.textContent = 'Member in the card.';
    });

</script>

<div bind:this={element} style="height:250px;overflow:auto;">
	{#each list as name}
    <h1>Hello {name}!</h1>
  {/each}
</div>

<button on:click={addName}>Add name</button>
<div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex justify-between mb-4">
      <button class="text-gray-600 hover:text-gray-800 font-medium focus:outline-none" id="admin-button">Admin</button>
      <button class="text-gray-600 hover:text-gray-800 font-medium focus:outline-none" id="member-button">Member</button>
    </div>
    <div id="card-content" class="text-gray-700">
      This is the card content.
    </div>
</div>
<style>

    #admin-button.active {
        background-color: #1e4e80;
        color: #fff;
    }
    
    #member-button.active {
        background-color: #1e4e80;
        color: #fff;
    }
    
    </style>
  

