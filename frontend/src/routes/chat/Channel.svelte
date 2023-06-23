<script lang="ts">

  import axios from "../../axios.config";
  import { onDestroy, onMount } from "svelte";
  import { id, user } from "../../stores";
  import { pop } from "svelte-spa-router";
  import ioClient from 'socket.io-client';
  import type { Socket } from "socket.io-client";
  import { type Channel, type PostEmitDto, type ChannelDto, type WsException, ChannelStatus } from "../../types";
  import lockedIcon from '../../assets/lock.svg'
  import publicIcon from '../../assets/public.svg'
  import privateIcon from '../../assets/private.svg'

  let socket: Socket = null
  let message: string = ''
  let password: string = ''
  let channel: Channel = null
  let isOwner: boolean = false
  let isAdmin: boolean = false
  let isMember: boolean = false
  let posts: PostEmitDto[] = []
  let channelName: string = null;
  let listChannel: any[] = [];
  let tab:string = "find";
  let chatbox: any

  export let channels: any[]

  onMount(() => {
    listChannel = channels.filter(channel => channel.users.some(_user => _user.username == $user.username))
  })

  onDestroy(() => closeSocket())

  async function _leaveChannel(name: string) {
    try {
      await axios.patch(`/channel/leave/${name}`)
    } catch(e) {
      console.log(e)
    }
  }

  function closeSocket() {
    if (socket){
      socket.disconnect()
    }
  }

  function post() {
    if (!message || message === '')
      return ;
    socket.emit('sendPost', {
      content: message,
      channelName: channel.name,
    }, (response: string) => {
      console.log(response)
      message = ''
    })
  }

  function joinRoom() {
    socket.emit('joinRoom', channel.name, (response: string) => {
      console.log(response)
    })
  }

  function joinChannel() {
    socket.emit('joinChannel', {
      channelName: channel.name,
      status: channel.status,
      password: password
    } as ChannelDto, (response: string) => {
      console.log(response)
      joinRoom()
    })
  }

  function leaveChannel() {
    socket.emit('leaveChannel', channel.name, (response: string) => {
      console.log(response)
      return pop()
    })
  }

  async function getChannel() {
    try {
      const response = await axios.get(`/channel/${channelName}`)
      channel = response.data
    } catch (e) {
      channel = null
      console.log(e)
    }
  }

  async function revokeAdmin(id: number) {
    try {
      await axios.patch(`/channel/${channel.name}/admin/revoke/${id}`, null)
      getChannel()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function promoteAdmin(id: number) {
    try {
      await axios.patch(`/channel/${channel.name}/admin/promote/${id}`, null)
      getChannel()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function ban(userId: number) {
    try {
      const response = await axios.delete(`/channel/${channel.name}/${userId}`)
      console.log(response)
      getChannel()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function setup(channelName: string) {
    channel = (await axios.get(`/channel/${channelName}`)).data
    socket = ioClient(axios.defaults.baseURL, {
      path: '/chat',
      withCredentials: true
    })

    if (channel.users.find(user => user.id.toString() === $id))
      joinRoom()
    else {
      if (confirm('Join this channel ?') === false)
        return pop()
      if (channel.status === 'Protected') {
        password = prompt('Enter password')
        if (password === '')
          console.error(`Unable to join channel ${channel.name}: Empty password.`)
        if (password === null)
          return pop()
      }
      joinChannel()
    }

    isOwner = channel.ownerId.toString() === $id
    isAdmin = channel.admins.some(admin => admin.id.toString() === $id)
    isMember = true

    socket.on('connect', () => {
      console.log('Connected')
    })

    socket.on('disconnect', (cause) => {
      console.log('Disconnected:', cause)
    })

    socket.on('post', (post: PostEmitDto) => {
      console.log('receive post')
      posts.push(post)
      posts = posts
    })

    // TODO: would be nice to pop _only_ when exception doesn't come from a post failure
    socket.on('exception', (e: WsException) => {
      console.error(e)
      return pop()
    })

    // TODO: is it used ?
    socket.on('error', (e) => {
      console.error(e)
      return pop()
    })

    // TODO: typedef event
    socket.on('channelEvent', (event: any) => {
      if (event.event === 'join') {
        const post: PostEmitDto = { channelName: '', content: `${event.user} joined the channel`, author: 'Event' }
        posts.push(post)
        posts = posts
      }
      else if (event.event === 'leave') {
        const post: PostEmitDto = { channelName: '', content: `${event.user} left the channel`, author: 'Event' }
        posts.push(post)
        posts = posts
      }
    })

  }

  function connectChannel(channel: string) {
    channelName = channel;
    setup(channel);
    tab = "channel";
    console.log("yes");
  }

</script>

<div class="chat-channel">

  <div class="nav">
    {#if tab == "find"}
      <button class="activeButton left" on:click={() => tab = "find"}>Your channels</button>
    {:else}
      <button class="left" on:click={() => tab = "find"}>Your channels</button>
    {/if}

    {#if tab == "channel"}
      <button class="activeButton right" on:click={() => tab = "channel"}>{#if channelName != null} {channelName} {:else} Channel {/if}</button>
    {:else}
      <button class="right" on:click={() => tab = "channel"}>{#if channelName != null} {channelName} {:else} Channel {/if}</button>
    {/if}
  </div>

  {#if tab == "find"}
    <div class="find">
      <div class="list">
        <ul>
          {#each listChannel as channel}
          <li class="lineFriends">
            <button on:click={() => connectChannel(channel.name)}>{channel.name}</button>
            {#if channel}
            <span>
              {#if channel.status === ChannelStatus.Protected}
                <img src={lockedIcon} alt='protected' width="30" height="30"/>
              {:else if channel.status === ChannelStatus.Public}
                <img src={publicIcon} alt='public' width="30" height="30"/>
              {:else if channel.status === ChannelStatus.Private}
                <img src={privateIcon} alt='private' width="30" height="30"/>
              {/if}
            </span>
            <span>
              <div class="badge badgs-xs badge-ghost">
              {#if channel.owner.id === $user.id}
                owner
              {:else if channel.admins.some(admin => admin.username === $user.username)}
                admin
              {:else}
                member
              {/if}
              </div>
            </span>
            <span>
              <button class="btn btn-xs" on:click={() => _leaveChannel(channel.name)}>
                leave
              </button>
            </span>
            {/if}
          </li>
        {/each}
        </ul>
      </div>
    </div>
  {:else}
    <div class="ctn-chan">


      <!-- <div class="marquee-container">
        <div class="marquee" aria-hidden="true">
          <span>name<b>{channel.name}</b></span>
          <span>Status<b>{channel.status}</b></span>
          <span>Owner<b><a contenteditable="false" bind:innerHTML={channel.owner.username} href="#/users/{channel.owner.username}"/></b></span>
          <span>Admins<b>
            {#each channel.admins.filter(admin => admin.id !== channel.ownerId) as admin}
            <a contenteditable="false" bind:innerHTML={admin.username} href="#/users/{admin.username}"/>
            {#if isOwner}
            <button on:click={() => revokeAdmin(admin.id)}>revoke admin</button>
            <button on:click={() => ban(admin.id)}>ban</button>
            {/if}
            {/each}
          </b></span>
          <span>Members<b>
            {#each channel.users.filter(user => !channel.admins.some(admin => admin.id === user.id)) as user}
            <a contenteditable="false" bind:innerHTML={user.username} href="#/users/{user.username}"/>
            {#if isOwner}
              <button on:click={() => promoteAdmin(user.id)}>promote admin</button>
              {/if}
              {#if isAdmin}
              <button on:click={() => ban(user.id)}>ban</button>
              {/if}
              {/each}
            </b>
          </span>
        </div>
      </div> -->

      <!-- <td>Admins</td>
        <td>
          {#each channel.admins.filter(admin => admin.id !== channel.ownerId) as admin}
          <a contenteditable="false" bind:innerHTML={admin.username} href="#/users/{admin.username}"/>
          {#if isOwner}
          <button on:click={() => revokeAdmin(admin.id)}>revoke admin</button>
          <button on:click={() => ban(admin.id)}>ban</button>
          {/if}
          {/each}
        </td> -->
        <!-- <td>Members</td>
          <td>
            {#each channel.users.filter(user => !channel.admins.some(admin => admin.id === user.id)) as user}
            <a contenteditable="false" bind:innerHTML={user.username} href="#/users/{user.username}"/>
            {#if isOwner}
            <button on:click={() => promoteAdmin(user.id)}>promote admin</button>
            {/if}
                {#if isAdmin}
                <button on:click={() => ban(user.id)}>ban</button>
                {/if}
                {/each}
              </td>
            </tr> -->
            <!-- <div class="overflow">
              <ul>
                {#each posts as post}
                <li><b>{post.author}</b>: {post.content}</li>
                {/each}
              </ul>
              <form on:submit|preventDefault={post}>
                <input type="text" placeholder="message" bind:value={message}>
                <button type="submit">send</button>
              </form>
            </div>
            <button on:click={() => leaveChannel()}>Leave</button> -->

            <div class="chan-list">
              <ul>
                {#if channel}
                <li><h1>--owner--</h1></li>
                <li><a contenteditable="false" bind:innerHTML={channel.owner.username} href="#/users/{channel.owner.username}"/></li>
                <li><h1>--admins--</h1></li>
                {#each channel.admins.filter(admin => admin.id !== channel.ownerId) as admin}
                <li>
                  <a contenteditable="false" bind:innerHTML={admin.username} href="#/users/{admin.username}"/>
                  {#if isOwner}
                  <div style="display: flex;">
                    <button on:click={() => revokeAdmin(admin.id)}>down</button>
                    <button on:click={() => ban(admin.id)}>ban</button>
                  </div>
                    {/if}
                </li>
                {/each}
                <li><h1>--users--</h1></li>
                {#each channel.users.filter(user => !channel.admins.some(admin => admin.id === user.id)) as user}
                <li>
                  <a contenteditable="false" bind:innerHTML={user.username} href="#/users/{user.username}"/>
                  <div style="display: flex;">
                    {#if isOwner}
                      <button class="btn btn-xs" on:click={() => promoteAdmin(user.id)}>up</button>
                    {/if}
                    {#if isAdmin}
                      <button class="btn btn-xs" on:click={() => ban(user.id)}>ban</button>
                    {/if}
                  </div>
                </li>
                {/each}
                {/if}
              </ul>
            </div>

            <div class="chat2">

              <div class="chatbox" bind:this={chatbox}>
                <ul class="message-list">
                  {#each posts as post}
                    {post.author} {$user.username}
                    {#if post.author == $user.username}
                      <li class="msg sender">{post.content}</li>
                    {:else}
                      <li class="msg receiver">{post.content}</li>
                    {/if}
                  {/each}
                </ul>
              </div>
              <form class="chat-form" on:submit|preventDefault={post}>
                <input type="text" placeholder="message" bind:value={message}>
              </form>

            </div>
           </div>

  {/if}


  </div>

<style>

.chat-channel{
  background-color: var(--lite-grey);
  border-radius: var(--panel-radius);
  display: grid;
  grid-template-rows: auto 1fr;
  height: var(--panel-height);
  width: var(--panel-width);
}

.nav {
  height: var(--nav-height);
  display: flex;
  justify-content: space-around;
}

.nav button {
  flex: auto;
  font-family: Courier, monospace;
  color: var(--orange);
  background-color: var(--grey);
}

.nav .activeButton {
  background-color: none;
  font-weight: bold;
}

.nav button:hover {
  text-decoration: underline;
}

.nav button:not(:last-child) {
  border-right: solid 1px var(--black);
}

.find {
  height: 360px;
  background-color: var(--lite-grey);
  border-radius: 0 0 15px 15px;
}

.list {
  flex: 1;
  overflow: auto;
}

.chan-list {
  overflow: auto;
}

li {
  height: 40px;
  display: grid;
  grid-template-columns: 2fr 1.5fr;
  background-color: var(--li-one);
}

li:nth-child(2n + 1) {
  background-color: var(--li-two);
}

.lineFriends {
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr;
}

li h1 {
  color: #fff;
}

.lineFriends span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ctn-chan {
  display: grid;
  grid-template-columns: 1fr 2fr;
  max-height: 331px;

}

.chatbox {
  width: 100%;
  height: 336px;
  overflow-y: scroll;
  background-color: #333;
  color: #fff;
}

.chat-form {
  display: flex;
}

.chat-form input {
  width: 100%;
border-radius: 0 0 var(--panel-radius) 0;
}

.message-list {
  list-style: none;
  margin: 1rem auto;
  padding: 0;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  --radius-big: 20px;
  --radius-small: 6px;

  word-wrap: break-word;
}

.msg {
  margin-bottom: 6px;
  padding: 12px;
  border-radius: 20px;
  background: #ddd;
  max-width: 150px;
  margin-right: auto;
}

.msg.sender {
  background: #0084ff;
  color: #fff;
  margin-left: auto;
  margin-right: 0;
}

.sender + .sender {
  border-radius: var(--radius-big) var(--radius-small)
    var(--radius-small) var(--radius-big);
}

.receiver + .sender {
  border-bottom-right-radius: var(--radius-small);
}

.sender + .receiver {
  border-radius: var(--radius-big) var(--radius-big)
    var(--radius-small) var(--radius-small);
}

.receiver + .receiver {
  border-radius: var(--radius-small);
}

*::-webkit-scrollbar {
  display: none;
}

@keyframes marquee {
  0% {
    left: 100%;
  }
  100% {
    left: -100%
  }
}

</style>
