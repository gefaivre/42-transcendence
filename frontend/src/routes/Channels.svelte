<script lang="ts">

  import axios from 'axios';
  import { logged } from "../stores";
  import { onMount } from "svelte";
  import type { Channel, ChannelDto } from "../types";
  import { ChannelStatus } from '../types';

  const columns: string[] = ['id', 'name', 'owner', 'owner id', 'users', 'admins', 'status']
  let channels: Channel[] = []

  let channel: ChannelDto = {
    channelName: null,
    status: null
  }

  onMount(() => getAll())

  async function getAll() {
    try {
      channels = (await axios.get('http://localhost:3000/channel', { withCredentials: true })).data
      console.log(channels)
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  async function remove(name: string) {
    if (!window.confirm("Are you sure ?"))
      return
    try {
      await axios.delete(`http://localhost:3000/channel/${name}`, { withCredentials: true })
      getAll()
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  async function removeAll() {
    if (!window.confirm("Are you sure ?"))
      return
    try {
      await axios.delete(`http://localhost:3000/channel`, { withCredentials: true })
      getAll()
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  async function create() {
    if (!channel.channelName)
      return alert('Empty channel name')
    if (!channel.status)
      return alert('Please select a status')
    try {
      await axios.post('http://localhost:3000/channel', channel, { withCredentials: true })
      getAll()
    } catch (error) {
      console.log(error.response.data.message)
    }
    channel.channelName = null
    channel.status = null
  }

</script>

<main>

{#if $logged}

  <br>
  <br>

  <table>
    <thead>
      <tr>
        <th colspan="7">Channels</th>
      </tr>
      <tr>
        {#each columns as column}
            <td>{column}</td>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each channels as c}
      <tr>
        <td>{c.id}</td>
        <td>{c.name}</td>
        <td><a contenteditable="false" bind:innerHTML={c.owner.username} href="#/users/{c.owner.username}"/></td>
        <td>???</td>
        <td>{c.users.length}</td>
        <td>{c.admins.length}</td>
        <td>{c.status}</td>
        <button on:click={() => remove(c.name)}>Delete</button>
      </tr>
      {/each}
    </tbody>
  </table>

  <br>
  <br>

  <button on:click={removeAll}>Delete all</button>

  <br>
  <br>

  <fieldset>
    <legend>Add Channel</legend><br>
    <input type=radio bind:group={channel.status} value={ChannelStatus.Public}>Public<br>
    <input type=radio bind:group={channel.status} value={ChannelStatus.Private}>Private<br>
    <input type=radio bind:group={channel.status} value={ChannelStatus.Protected}>Protected<br>
    <input type="text" bind:value={channel.channelName} placeholder="channel name">
    <button on:click={create}>Add</button>
  </fieldset>

  <br>
  <br>

  {channel.status}

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

</main>
