<script lang="ts">
  import { tick } from "svelte";
  import axios from "../../axios.config";
  import { user } from "../../stores";
  import lockedIcon from '../../assets/lock.svg'
  import { ChannelStatus } from "../../types";

  export let channels: any[]

  async function joinChannel(channelName: string) {
    try {
      await axios.patch(`http://localhost:3000/channel/join/${channelName}`)
      channels.splice(channels.findIndex(channel => channel.name === channelName))
      channels = channels
      tick()
    } catch(e) {
      console.log(e)
    }
  }
</script>

<div class="create-pannel">

  <div class="title">
    <h1>All channels</h1>
  </div>

  <div class="list">
    <ul>
    {#each channels as channel}
      {#if channel.users.some(_user => _user.username === $user.username) === false}
      <li class="lineFriends">
        <span>
          {channel.name}
        </span>
        <span>
        {#if channel.status === ChannelStatus.Protected}
          <img src={lockedIcon} alt='' width="30" height="30"/>
        {/if}
        </span>
        <span>
          <button class="btn btn-xs" on:click={() => joinChannel(channel.name)}>join</button>
        </span>
      </li>
      {/if}
    {/each}
    </ul>
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

.list {
  flex: 1;
  overflow: auto;
}

.lineFriends {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr;
}

.lineFriends span {
  display: flex;
  align-items: center;
  justify-content: center;
}

li {
  height: 40px;
  display: grid;
  grid-template-columns: 1fr;
  background-color: var(--li-one);
}

li:nth-child(2n + 1) {
  background-color: var(--li-two);
}

*::-webkit-scrollbar {
  display: none;
}

</style>