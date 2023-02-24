<script lang="ts">
  import  ioClient  from 'socket.io-client';
  import { onMount } from "svelte";

  const socket = ioClient('http://localhost:3000', {path: '/chat'});

  class Message {
      username: string;
      text: string;
    }
    
  let messages: Message[] = [];
  let textfield = '';
  let username = ''

  onMount(() => {
        socket.emit('getMessages', {}, (res : Message[]) => {
          messages = [...res]
          })
    })
  socket.on('recMessage', (message: Message) => {
      messages = [...messages, message]
    });

  function sendMessage() {
      const message = textfield.trim();
      if (!message)
        return;
      let toSend: Message = {username: username, text: textfield};
      console.log(toSend);
      socket.emit('sendMessage', toSend)
    }
</script>

<h2>Test de chatRoom</h2>
<p>liste des messages</p>
<ul>
{#each messages as message}
<li>{message.username}: {message.text}</li>
{/each}
</ul>

<form on:submit|preventDefault={sendMessage}>
  <input type="text" bind:value={username} placeholder="type your username">
  <input type="text" bind:value={textfield} placeholder="type your message">
  <button type="submit">send</button>
</form>

<style>
</style>
