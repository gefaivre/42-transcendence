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
    import Username from "../usersComponents/user-settings/Username.svelte";

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
            <button class="chanName" on:click={() => connectChannel(channel.name)}>{channel.name}</button>
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

    {#if isMember}
    <div class="marquee-container">
      <div class="marquee" aria-hidden="true">
        <span>name: <b>{channel.name}</b></span>
        <span>Status: <b>{channel.status}</b></span>
        <span>Owner: <b><a contenteditable="false" bind:innerHTML={channel.owner.username} href="#/users/{channel.owner.username}"/></b></span>
        <span>Admins: <b>
          {#each channel.admins.filter(admin => admin.id !== channel.ownerId) as admin}
            <a contenteditable="false" bind:innerHTML={admin.username} href="#/users/{admin.username}"/>
            <!-- {#if isOwner}
              <button on:click={() => revokeAdmin(admin.id)}>revoke admin</button>
              <button on:click={() => ban(admin.id)}>ban</button>
            {/if} -->
          {/each}
        </b></span>
        <span>Members: <b>
          {#each channel.users.filter(user => !channel.admins.some(admin => admin.id === user.id)) as user}
            <a contenteditable="false" bind:innerHTML={user.username} href="#/users/{user.username}"/>
            <!-- {#if isOwner}
              <button on:click={() => promoteAdmin(user.id)}>promote admin</button>
            {/if}
            {#if isAdmin}
              <button on:click={() => ban(user.id)}>ban</button>
            {/if}-->
          {/each}
        </b>
        </span>
      </div>
    </div>

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

        <div class="chatbox" bind:this={chatbox}>
        <ul class="message-list">

          {#each posts as post}
          {#if post.author != $user.username}
            <li class="msg receiver">
            <span class="author">*{post.author}:</span><br>
            <span class="content">{post.content}</span></li>
          {:else}
            <li class="msg sender"><span class="content">{post.content}</span></li>
          {/if}
          {/each}
          </ul>
      </div>
      <form on:submit|preventDefault={post}>
        <input type="text" class="input input-sm inpput-bordered" placeholder="message" bind:value={message}>
        <button type="submit" class="btn btn-sm send">send</button>
      </form>
    {/if}

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
  font-size:1.2em;
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

.lineFriends {
  color:white;
  display: grid;
  grid-template-columns: 4fr 1fr 1fr 1fr;
  background-color: var(--li-one);
  height:40px;
}

.lineFriends:nth-child(2n + 1) {
  background-color: var(--li-two);
}

.chanName:hover {
  text-decoration:underline;
}

.lineFriends span {
  display: flex;
  align-items: center;
  justify-content: center;
}

.marquee-container {
  height: 30px;
  overflow: hidden;
  position: relative;
  line-height: 30px;
}

.marquee {
  top: 0;
  left: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
  animation: marquee 20s linear infinite;
}

.chatbox {
  height:100%;
  width: 80%;
  overflow-y: scroll;
  background-color: var(--grey);
  color: #fff;
  border: 2px solid var(--pink);
  border-radius:10px;
  margin-left:10%;
}

form {
  margin-left: 20%;
  margin-right: 20%;
  margin-bottom:2%;
  margin-top:2%;
}

input {
  float:left;
}
.send {
  float:right;
}

.message-list {
  list-style: none;
  margin: 1rem auto;
  padding: 0;
  max-width: 400px;
  display: flex;
  flex-direction: column;

  --radius-big: 20px;
  --radius-small: 6px;

}

.msg {
  overflow-wrap: break-word;
  margin-bottom:1em;

}

.msg.sender {
  text-align: right;

}

.msg.receiver {
  text-align:left;
}

.content {
  border-radius:var(--radius-big);
  box-decoration-break: clone;
  padding:3%;
  line-height:2.5em;
}

.author {
  margin-left:1%;
  font-size:0.8em;
}

.msg.sender .content {
  background-color: var(--pink);
}

.msg.receiver .content {
  background-color: var(--lite-grey);

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
