<script lang="ts">

  import axios from "../../axios.config";
  import { logged } from "../../stores";
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import ioClient from 'socket.io-client';
  import type { Socket } from "socket.io-client";
  import type { DirectMessage, User, WsException } from "../../types";
  import { push } from "svelte-spa-router";

  export let user: User;

  let socket: Socket = null
  let message: string = null
  let messages: DirectMessage[] = []
  let chatbox: any
  let tab: string = "find";
  let listDm: string[] = [];
  let chatUser: string = null;

  onMount(() => getAll())

  async function load(username: string) {
    try {
      const response = await axios.get(`/posts/dm/${username}`)
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

  async function getAll() {
    try {
      listDm = (await axios.get('/users/me/dm')).data
      console.log(listDm)
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

  function sendDM() {
    socket.emit('sendDirectMessage', {
      content: message,
      recipient: chatUser
    } as DirectMessage, (response: string) => {
      console.log(response)
      message = ''
      messages = messages
    })
  }

  function pushToDmTab(username: string) {
    chatUser = username;
    load(username);
    tab = "dm";

  }

  onDestroy(() => socket.disconnect())

  // afterUpdate(() => {
  //   chatbox.scroll({ top: chatbox.scrollHeight, behavior: 'smooth'})
  // })

</script>

<div class="chat-dm">

  <div class="nav">
    {#if tab == "find"}
      <button class="activeButton" on:click={() => tab = "find"}>find</button>
    {:else}
      <button on:click={() => tab = "find"}>find</button>
    {/if}

    {#if tab == "dm"}
      <button class="activeButton" on:click={() => tab = "dm"}>dm</button>
    {:else}
      <button on:click={() => tab = "dm"}>dm</button>
    {/if}
  </div>

  {#if tab == "find"}
  <div class="find">
    <div class="list list_friends">
      <div class="title">
        <h2>All your friends</h2>
      </div>
      <ul class="friends-list">
        {#if user !== undefined}
          {#each user.friends as friend}
            <li> <button on:click={() => pushToDmTab(friend.username)}> {friend.username}</button> </li>
          {/each}
        {/if}
      </ul>
    </div>
    <div class="list list-all">
    <div class="title">
      <h2>Recent dm</h2>
    </div>
      <ul class="friends-list">
        {#each listDm as name}
          <li><button on:click={() => pushToDmTab(name)}> {name}</button></li>
        {/each}
      </ul>
    </div>
  </div>
  {:else}
  <div class="ch">
    {#if chatUser == null}
      <h1>you are not conected with a user</h1>
    {:else}
      <h1>{chatUser}</h1>
      <button class="invite-button" on:click={() => push(`/Pong?player2=${chatUser}`)}>invite to play</button>
      <div class="chatbox" bind:this={chatbox}>
        <ul class="message-list">
          {#each messages as _message}
            {_message.date}
            {#if _message.sender !== chatUser}
            <li class="msg sender">{_message.content}</li>
            {:else}
            <li class="msg receiver">{_message.content}</li>
            {/if}
            {/each}
          </ul>
      </div>
      <form on:submit|preventDefault={sendDM}>
        <input type="text" placeholder="message" bind:value={message}>
        <button type="submit">send</button>
      </form>
    {/if}
  </div>
  {/if}

</div>

<style>


.chat-dm {
  background-color: var(--lite-grey);
  border: solid 1px black;
  border-radius: 40px;
  display: grid;
  grid-template-rows: auto 1fr;
  margin: 20px;
}

  .nav {
    height: 40px;
    display: flex;
    justify-content: space-around;
  }

  .nav button {
    border-bottom: solid 1px var(--black);
    flex: auto;
  }

  .nav .activeButton {
    border-bottom: none;
  }

  .nav button:not(:last-child) {
    border-right: solid 1px var(--black);
  }

  .find {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    height: 100%;

  }

  .list {
    background-color: var(--lite-grey);
    border: solid 1px black;
    border-radius: 30px;
    margin: 30px;
  }

  .list .title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
  }

  li {
    height: 40px;
    display: grid;
    grid-template-columns: 1fr;
    background-color: var(--lite-lite-lite-grey);
  }
  li:nth-child(2n + 1) {
    background-color: var(--lite-lite-grey);
  }



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

</style>