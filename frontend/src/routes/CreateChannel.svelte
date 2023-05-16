<script lang="ts">
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import Layout from "./Layout.svelte";
    import ChanMenu from "./chanLayouts.svelte";
    let channelName = '';
    let visibility = 'Public';
    let password = '';
    
    async function createChan(channelData){
        let channel = { channelName: null, status: null, password: ''};
        console.log(channelData);
        channel.channelName = channelData.name;
        channel.status = visibility;
        if (channel.status == 'Protected')
          channel.password = password;
        const response = await
        axios.post('http://localhost:3000/channel', channel, { withCredentials: true });
        console.log(response);

    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const channelData = {
        name: channelName,
        visibility: visibility,
        password: password
        };
        createChan(channelData);
        window.location.href = '/#/message'; // envoyer les données au backend
  };

  </script>

  <style>
  .create {
    position: absolute;
    left: 448px;
    top: 0px;
    height: 100%;
    width: 50%;
    background-color: var(--black);
  }
 </style>

    <ChanMenu>
    </ChanMenu>
    <div class=create>
        <form class="p-4 rounded-md" on:submit={handleSubmit}>
            <div class="mb-4">
              <label for="name" class="block text-purple-700 font-bold mb-2">Name</label>
              <input type="text" id="name" class="border border-gray-400 p-2 w-full" bind:value={channelName} required />
            </div>
            <div class="mb-4">
              <label for="visibility" class="block text-purple-700 font-bold mb-2">Visibility</label>
              <select id="visibility" class="border border-gray-400 p-2 w-full" bind:value={visibility}>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Protected">Protected</option>
              </select>
            </div>
            {#if visibility === 'Protected'}
              <div class="mb-4">
                <label for="password" class="block text-purple-700 font-bold mb-2">Password</label>
                <input type="password" id="password" class="border border-gray-400 p-2 w-full" bind:value={password} required />
              </div>
            {/if}
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right">Créer la chaîne</button>
          </form>
    </div>