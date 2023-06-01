<script lang="ts">

  import axios from '../axios.config';
  import { logged } from "../stores";
  import { onMount } from "svelte";
  import type { Channel, ChannelDto } from "../types";
  import { ChannelStatus } from '../types';
  import { toast } from '@zerodevx/svelte-toast/dist'

  const columns: string[] = ['id', 'name', 'owner', 'owner id', 'users', 'admins', 'status']
  let channels: Channel[] = []

  let channel: ChannelDto = {
    channelName: null,
    status: null,
    password: null
  }

  onMount(() => getAll())

  async function getAll() {
    try {
      channels = (await axios.get('/channel')).data
      console.log(channels)
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  // TODO: ensure every socketio client leave the room before deleting the channel (cf. server.socketsLeave())
  async function remove(name: string) {
    if (window.confirm("Are you sure ?") === false)
      return
    try {
      await axios.delete(`/channel/${name}`)
      getAll()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  // TODO: ensure every socketio client leave the room before deleting the channel (cf. server.socketsLeave())
  async function removeAll() {
    if (window.confirm("Are you sure ?") === false)
      return
    try {
      await axios.delete(`/channel`)
      getAll()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function create() {

    if (channel.channelName === null) {
      toast.push('Empty channel name', { classes: ['failure'] })
      return
    }
    if (channel.status === null) {
      toast.push('Please select a status', { classes: ['failure'] })
      return
    }
    if (channel.status === ChannelStatus.Protected && channel.password === '') {
      toast.push('Empty channel password', { classes: ['failure'] })
      return
    }

    try {
      console.log(channel);
      await axios.post('/channel', channel)
      getAll()
    } catch (e) {
      console.log(e.response.data.message)
    }
    channel.channelName = null
    channel.status = null
    channel.password = null
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
        <td><a contenteditable="false" bind:innerHTML={c.name} href="#/channel/{c.name}"/></td>
        <td><a contenteditable="false" bind:innerHTML={c.owner.username} href="#/users/{c.owner.username}"/></td>
        <td>{c.ownerId}</td>
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
    <input type=radio bind:group={channel.status} value={ChannelStatus.Public}>Public &#9989<br>
    <input type=radio bind:group={channel.status} value={ChannelStatus.Private}>Private &#9940<br>
    <input type=radio bind:group={channel.status} value={ChannelStatus.Protected}>Protected &#128273<br>
    <input type="text" bind:value={channel.channelName} placeholder="channel name">
    <button on:click={create}>Add</button>
    {#if channel.status === ChannelStatus.Protected}
      <input type="text" bind:value={channel.password} placeholder="password">
    {/if}
  </fieldset>

  <br>
  <br>

  {channel.status}

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

</main>
