<script lang="ts">
    import type { Channel, ChannelDto, User } from "../../types";
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
      channels = (await axios.get('http://localhost:3000/channel', { withCredentials: true })).data
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
      await axios.delete(`http://localhost:3000/channel/${name}`, { withCredentials: true })
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
      await axios.delete(`http://localhost:3000/channel`, { withCredentials: true })
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
      await axios.post('http://localhost:3000/channel', channel, { withCredentials: true })
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

  <h1>Create Channel</h1>

  <div class="create">


    <fieldset>
      <legend>Add Channel</legend><br>
      <input type=radio bind:group={channel.status} value={ChannelStatus.Public}>Public &#9989<br>
      <input type=radio bind:group={channel.status} value={ChannelStatus.Private}>Private &#9940<br>
      <input type=radio bind:group={channel.status} value={ChannelStatus.Protected}>Protected &#128273<br>
      <input type="text" bind:value={channel.channelName} placeholder="channel name">
      <button on:click={create}>Add</button>
      {#if channel.status == ChannelStatus.Protected}
      <input type="text" bind:value={channel.password} placeholder="password">
      {/if}
    </fieldset>

  </div>
  </div>

<style>

.create-pannel {
  background-color: var(--lite-grey);
  border: solid 1px black;
  border-radius: 40px;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 80%;
  width: 80%;

}

h1 {
  height: 35px;
  text-align: center;
}

 .create {
   display: flex;
   justify-content: center;
   align-items: center;
 }

</style>