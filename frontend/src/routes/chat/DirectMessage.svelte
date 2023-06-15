<script lang="ts">

  import axios from "../../axios.config";
  import { logged } from "../../stores";
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import ioClient from 'socket.io-client';
  import type { Socket } from "socket.io-client";
  import type { DirectMessage, WsException } from "../../types";
  import { push } from "svelte-spa-router";

  export let params: any = {}

  let socket: Socket = null
  let message: string = null
  let messages: DirectMessage[] = []
  let chatbox: any

  onMount(() => load())

  async function load() {
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

    socket.on('dm', (_message: string, sender: string, date: Date) => {
      const dm: DirectMessage = {
        content: _message,
        sender: sender,
        recipient: 'foo',
        date: date
      }
      messages.push(dm)
      messages = messages
    })
  }

  function sendDM() {
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

  afterUpdate(() => {
    chatbox.scroll({ top: chatbox.scrollHeight, behavior: 'smooth'})
  })

</script>

{#if $logged === 'true'}
  <br>
  <h1>{params.name}</h1>
  <button class="invite-button" on:click={() => push(`/Pong?player2=${params.name}`)}>invite to play</button>
  <br>
  <div class="chatbox" bind:this={chatbox}>
  <ul>
  {#each messages as _message}
    {_message.date}
    {#if _message.sender !== params.name}
      <li class="msg sender">{_message.content}</li>
    {:else}
      <li class="msg receiver">{_message.content}</li>
    {/if}
  {/each}
  </ul>
  </div>
  <br>
  <br>
  <form on:submit|preventDefault={sendDM}>
    <input type="text" placeholder="message" bind:value={message}>
    <button type="submit">send</button>
  </form>
{:else}
  <h1>UNAUTHORIZED ACCESS</h1>
{/if}

<style>

.chatbox {
  height: 80%;
  width: 50%;
  overflow-y: auto;
  background-color: #333;
  color: #fff;
  border: 2px solid green;
  margin-left: 25%;
  margin-right: 25%;
}

.invite-button {
  margin-left: 25%;
  margin-right: 25%;
}

form {
  margin-left: 25%;
  margin-right: 25%;
}

ul {
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

</style>