<script lang="ts">

  import { logged } from "../stores";
  import { onMount, onDestroy } from "svelte";
  import ioClient from 'socket.io-client';
  import type { Socket } from "socket.io-client";
  import type { DirectMessage, WsException } from "../types";
  import axios from "../axios.config";

  export let params: any = {}
  let socket: Socket = null
  let message: string = null
  let messages: DirectMessage[] = []

  onMount(async () => {

    try {
      const response = await axios.get(`/posts/dm/${params.username}`)
      messages = response.data
      console.log(response)
    } catch (e) {
      console.log(e)
      return
    }

    socket = ioClient(axios.defaults.baseURL, {
      path: '/chat',
      withCredentials: true
    })

    socket.on('connect', () => {
      console.log('Connected')
    })

    socket.on('exception', (e: WsException) => {
      console.error(e)
    })

    socket.on('dm', (_message: string) => {
      const dm: DirectMessage = {
        content: _message,
        sender: params.username,
        recipient: 'foo'
      }
      messages.push(dm)
      messages = messages
    })

  })

  function dm() {
    socket.emit('sendDirectMessage', {
      content: message,
      recipient: params.username
    } as DirectMessage, (response: string) => {
      console.log(response)
      message = ''
    })
  }

  onDestroy(() => socket.disconnect())

</script>

{#if $logged === 'true'}
  <br>
  <br>
  <h1>{params.username}</h1>
  <br>
  <br>
  {#each messages as _message}
    <li><b>{_message.sender}</b>: {_message.content}</li>
  {/each}
  <br>
  <br>
  <form on:submit|preventDefault={dm}>
    <input type="text" placeholder="message" bind:value={message}>
    <button type="submit">send</button>
  </form>
  <br>
  <br>
{:else}
  <h1>UNAUTHORIZED ACCESS</h1>
{/if}