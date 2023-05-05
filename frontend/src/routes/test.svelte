<script lang="ts">
  import { afterUpdate } from 'svelte';



  afterUpdate(() => {
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
  });

  // ...
</script>


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

    #member-button:focus {
        background-color: #801e6b;
        color: purple;
    }
    #admin-button:focus {
        background-color: #1e4e80;
        color: purple;
    }
    
    </style>
  

