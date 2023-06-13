<script lang="ts">

  import axios from "../../axios.config";
  import { logged } from "../../stores";
  import { onMount, onDestroy } from "svelte";
  import ioClient from 'socket.io-client';
  import type { Socket } from "socket.io-client";
  import type { DirectMessage, WsException } from "../../types";

  export let params: any = {}
  const name = params.name;


  let socket: Socket = null
  let message: string = null
  let messages: DirectMessage[] = []


  onMount(() => load())

  async function load()
  {
    try {
      const response = await axios.get(`/posts/dm/${params.name}`, { withCredentials: true })
      messages = response.data
      console.log(response)
    } catch (e) {
      console.log(e)
      return
    }

    socket = ioClient('http://localhost:3000', {
      path: '/chat',
      withCredentials: true
    })

    socket.on('connect', () => {
      console.log('Connected')
    })

    socket.on('exception', (e: WsException) => {
      console.error(e)
    })

    socket.on('dm', (_message: string, sender: string) => {
      const dm: DirectMessage = {
        content: _message,
        sender: sender,
        recipient: 'foo'
      }
      messages.push(dm)
      messages = messages
    })
  }


  function dm() {
    socket.emit('sendDirectMessage', {
      content: message,
      recipient: params.name
    } as DirectMessage, (response: string) => {
      console.log(response)
      message = ''
      messages = messages
    })
  }

  onDestroy(() => socket.disconnect())

  </script>

  {#if $logged === 'true'}
    <br>
    <br>
    <h1>{params.name}</h1>
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