<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import Layout from "./Layout.svelte";
    import ChanMenu from "./chanLayouts.svelte";
    let channelName = '';
    let visibility = 'public';
    let password = '';
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const channelData = {
        name: channelName,
        visibility: visibility,
        password: password
        };
        console.log(channelData); // envoyer les données au backend
  };

  </script>

  <style>
  .create {
    position: absolute;
    left: 448px;
    top: 0px;
    height: 100%;
    width: 50%;
  }
 </style>

 <Layout>
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
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="protected">Protected</option>
              </select>
            </div>
            {#if visibility === 'protected'}
              <div class="mb-4">
                <label for="password" class="block text-purple-700 font-bold mb-2">Password</label>
                <input type="password" id="password" class="border border-gray-400 p-2 w-full" bind:value={password} required />
              </div>
            {/if}
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded float-right">Créer la chaîne</button>
          </form>
    </div>
 </Layout>