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
  let isMember: boolean = false
  let posts: PostEmitDto[] = []

  // $: foo = posts

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

  })

  onDestroy(() => socket.disconnect())

</script>

{#if $logged === 'true'}
  <br>
  <br>
  <!-- TODO: display admins and users -->
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
          <td>Owner</td> <td>{channel.ownerId}</td>
        </tr>
        <tr>
          <td>Status</td> <td>{channel.status}</td>
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