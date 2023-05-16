<script lang="ts">

  import axios from "axios";
  import { onDestroy, onMount } from "svelte";
  import { logged, id } from "../stores";
  import { pop } from "svelte-spa-router";
  import ioClient from 'socket.io-client';
  import type { Socket } from "socket.io-client";
  import type { Channel, PostEmitDto, ChannelDto, WsException } from "../types";

  export let params: any = {}
  let socket: Socket = null
  let message: string = ''
  let password: string = ''
  let channel: Channel = null
  let isOwner: boolean = false
  let isAdmin: boolean = false
  let isMember: boolean = false
  let posts: PostEmitDto[] = []

  function post() {
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
      const response = await axios.get(`http://localhost:3000/channel/${params.name}`, { withCredentials: true })
      channel = response.data
    } catch (e) {
      channel = null
      console.log(e)
    }
  }

  async function revokeAdmin(id: number) {
    try {
      await axios.patch(`http://localhost:3000/channel/${channel.name}/admin/revoke/${id}`, null, { withCredentials: true })
      getChannel()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function promoteAdmin(id: number) {
    try {
      await axios.patch(`http://localhost:3000/channel/${channel.name}/admin/promote/${id}`, null, { withCredentials: true })
      getChannel()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  async function ban(userId: number) {
    try {
      const response = await axios.delete(`http://localhost:3000/channel/${channel.name}/${userId}`, { withCredentials: true })
      console.log(response)
      getChannel()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  // TODO: what if we manually change `id` store value ?
  onMount(async () => {

    channel = (await axios.get(`http://localhost:3000/channel/${params.name}`, { withCredentials: true })).data

    socket = ioClient('http://localhost:3000', {
      path: '/chat',
      withCredentials: true
    })

    if (channel.users.find(user => user.id.toString() === $id))
      joinRoom()
    else {
      if (!confirm('Join this channel ?'))
        return await pop()
      if (channel.status === 'Protected') {
        password = prompt('Enter password')
        if (password === '')
          console.error(`Unable to join channel ${channel.name}: Empty password.`)
        if (!password)
          return await pop()
      }
      joinChannel()
    }

    isOwner = channel.ownerId.toString() === $id
    isAdmin = channel.admins.some(admin => admin.id.toString() === $id)
    isMember = true

    socket.on('connect', () => {
      console.log('Connected')
    })

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason)
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

  })//fin

  onDestroy(() => socket.disconnect())

</script>

{#if $logged === 'true'}
  <br>
  <br>
  {#if isMember}
    <table>
      <tbody>
        <tr>
          <td>id</td> <td>{channel.id}</td>
        </tr>
        <tr>
          <td>name</td> <td>{channel.name}</td>
        </tr>
        <tr>
          <td>Status</td> <td>{channel.status}</td>
        </tr>
        <tr>
          <td>Owner</td>
          <td><a contenteditable="false" bind:innerHTML={channel.owner.username} href="#/users/{channel.owner.username}"/></td>
        </tr>
        <tr>
          <td>Admins</td>
          <td>
          {#each channel.admins.filter(admin => admin.id !== channel.ownerId) as admin}
            <a contenteditable="false" bind:innerHTML={admin.username} href="#/users/{admin.username}"/>
            {#if isOwner}
              <button on:click={() => revokeAdmin(admin.id)}>revoke admin</button>
              <button on:click={() => ban(admin.id)}>ban</button>
            {/if}
            <br>
          {/each}
          </td>
        </tr>
        <tr>
          <td>Members</td>
          <td>
          {#each channel.users.filter(user => !channel.admins.some(admin => admin.id === user.id)) as user}
            <a contenteditable="false" bind:innerHTML={user.username} href="#/users/{user.username}"/>
            {#if isOwner}
              <button on:click={() => promoteAdmin(user.id)}>promote admin</button>
            {/if}
            {#if isAdmin}
              <button on:click={() => ban(user.id)}>ban</button>
            {/if}
            <br>
          {/each}
          </td>
        </tr>
      </tbody>
    </table>
    <ul>
    {#each posts as post}
      <li><b>{post.author}</b>: {post.content}</li>
    {/each}
    </ul>
    <br>
    <br>
    <form on:submit|preventDefault={post}>
      <input type="text" placeholder="message" bind:value={message}>
      <button type="submit">send</button>
    </form>
    <br>
    <br>
    <button on:click={() => leaveChannel()}>Leave</button>
  {/if}
{:else}
  <h1>UNAUTHORIZED ACCESS</h1>
{/if}

<style>
  ul {
    display: inline-block;
    text-align: left;
  }
</style>