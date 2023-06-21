<script lang="ts">

  import type { Channel, ChannelDto } from "../../types";
  import axios from "../../axios.config";
  import { ChannelStatus } from '../../types';

  let channels: Channel[] = []

  let channel: ChannelDto = {
    channelName: null,
    status: null,
    password: ''
  }

  async function getAll() {
    try {
      channels = (await axios.get('channel', { withCredentials: true })).data
      console.log(channels)
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  // TODO: ensure every socketio client leave the room before deleting the channel (cf. server.socketsLeave())
  async function remove(name: string) {
    if (!window.confirm("Are you sure ?"))
      return
    try {
      await axios.delete(`channel/${name}`, { withCredentials: true })
      getAll()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  // TODO: ensure every socketio client leave the room before deleting the channel (cf. server.socketsLeave())
  async function removeAll() {
    if (!window.confirm("Are you sure ?"))
      return
    try {
      await axios.delete(`channel`, { withCredentials: true })
      getAll()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function create() {
    if (!channel.channelName)
      return alert('Empty channel name')
    if (!channel.status)
      return alert('Please select a status')
    if (channel.status === ChannelStatus.Protected && channel.password === '')
      return alert('Empty channel password')
    try {
      console.log(channel);
      await axios.post('channel', channel, { withCredentials: true })
      getAll()
    } catch (e) {
      console.log(e.response.data.message)
    }
    channel.channelName = null
    channel.status = null
    channel.password = ''
  }

</script>

<div class="create-pannel">

  <div class="title">
    <h1>Create Channel</h1>
  </div>

  <div class="create">
    <fieldset>
      <input type="text" class="input input-sm inpput-bordered" bind:value={channel.channelName} placeholder="channel name">
      <br>
      <br>
      <select class="select select-sm select-bordered" bind:value={channel.status}>
        <option value={ChannelStatus.Public} selected>Public</option>
        <option value={ChannelStatus.Private}>Private</option>
        <option value={ChannelStatus.Protected}>Protected</option>
      </select>
      {#if channel.status == ChannelStatus.Protected}
        <br>
        <br>
        <input type="text" class="input input-sm input-bordered" bind:value={channel.password} placeholder="password">
      {/if}
      <br>
      <br>
      <button class="btn btn-sm" on:click={create}>Create</button>
    </fieldset>
  </div>

</div>

<style>

.create-pannel {
  background-color: var(--lite-grey);
  border-radius: var(--panel-radius);
  display: grid;
  grid-template-rows: auto 1fr;
  height: var(--panel-height);
  width: var(--panel-width);
}

.title {
  display: flex;
  height: 40px;
  background-color: var(--grey);
  justify-content: center;
  align-items: center;
  border-radius: var(--panel-radius) var(--panel-radius) 0 0;
}

h1 {
  font-family: Courier, monospace;
  color: var(--orange);
}

.create {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>