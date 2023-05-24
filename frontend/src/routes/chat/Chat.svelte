<script lang="ts">
  import axios from '../../axios.config'
  import ioClient from 'socket.io-client';
  import { onMount } from "svelte";
  import { logged, id } from '../../stores';
  import type { ChannelStatus, ChannelDto, PostEmitDto, ChannelBis, WsException } from '../../types';

  const socket = ioClient('http://localhost:3000', {
    path: '/chat',
    withCredentials: true
  });

  let channels: ChannelBis[] = [];

  onMount(() => getAll())

  // TODO: what if we manually change `id` store value ?
  async function getAll() {
    channels = (await axios.get('/channel')).data
    for (const channel of channels) {
      channel.posts = [];
      if (channel.users.find((user: any) => user.id.toString() === $id))
        joinRoom(channel.name)
    }
    channels = channels;
    console.log('channel', channels)
  }

  socket.on('post', (post: PostEmitDto) => {
    console.log('post', post);
    const channel = channels.find(channel => channel.name === post.channelName);
    if (channel)
      channel.posts.push(post);
    channels = channels;
  });

  socket.on('exception', (e: WsException) => console.error(e))

  socket.on('channelEvent', (event: any) => {
    if (event.event === 'join')
      console.log(event.user, 'joined the chanel')
    else if (event.event === 'leave')
      console.log(event.user, 'left the chanel')
  })

  function joinChannel(channel: ChannelBis) {
    let password: string = ''
    if (channel.status === 'Protected') {
      password = prompt('Enter password')
      if (password === '')
        return console.error(`Unable to join channel ${channel.name}: Empty password.`)
      if (password === null)
        return console.error(`Unable to join channel ${channel.name}: No password provided.`)
    }
    socket.emit('joinChannel', {
      channelName: channel.name,
      status: channel.status,
      password: password
    } as ChannelDto, (response: any) => {
      console.log(response)
      joinRoom(channel.name)
    })
  }

  function joinRoom(channelName: string) {
    socket.emit('joinRoom', channelName, (response: any) => {
      console.log(response)
      const chan = channels.find(channel => channel.name === channelName);
      if (chan) {
        chan.joined = true;
        channels = channels;
      }
    })
  }

  function leaveChannel(channelName: string) {
    socket.emit('leaveChannel', channelName, (response: any) => {
      console.log('leave channel', channelName, response)
      const chan = channels.find(channel => channel.name === channelName);
      if (chan) {
        chan.posts = []
        chan.joined = false;
        channels = channels;
      }
    })
  }

  function sendMessage(channelName: string, event: any) {
    const formData = new FormData(event.target);
    const content: string = formData.get('textfield') as string
    if (content)
      socket.emit('sendPost', {
        content: content,
        channelName: channelName
      }, (response: any) => {
        console.log(response)
        formData.set(content, null)
      })
  }

  async function createChannel(event: any) {

    const formData = new FormData(event.target);

    if (formData.get('channelName') === '')
      return alert('Empty name')

    if (formData.has('channelStatus') === false)
      return alert('Empty status')

    let pass: string
    if (formData.get('channelStatus') === 'Protected') {
      pass = window.prompt('Enter password');
      if (pass === '')
        return alert('Empty password')
      if (pass === null)
        return
    } else {
      pass = ''
    }

    let channel: ChannelDto = {
      channelName: formData.get('channelName') as string,
      status: formData.get('channelStatus') as ChannelStatus,
      password: pass
    }

    try {
      await axios.post('/channel', channel)
      console.log(`Channel ${channel.channelName} successfully created.`)
      getAll()
    } catch (e) {
      console.log(e.response.data.message)
    }
  }

</script>


{#if $logged === 'true'}

<h1>Channels</h1>

{#each channels as channel}

  <h3>{channel.name} ({channel.status})</h3>

{#if channel.joined}
  <button on:click={() => leaveChannel(channel.name)}>leave this channel</button>
  <ul>
    {#each channel.posts as post}
    <li><b>{post.author}</b>: {post.content}</li>
    {/each}
  </ul>
  <form on:submit|preventDefault={(event) => sendMessage(channel.name, event)}>
    <input id="textfield" name="textfield" type="text" placeholder="type your message">
    <button type="submit">send post</button>
  </form>
{:else}
  <button on:click={() => joinChannel(channel)}>join this channel</button>
{/if}
  <br>
  <hr class="solid">
  <br>
{/each}
  <form on:submit|preventDefault={createChannel}>
    <input id="channelStatus" name="channelStatus" type="radio" value="Public">Public &#9989<br>
    <input id="channelStatus" name="channelStatus" type="radio" value="Private">Private &#9940<br>
    <input id="channelStatus" name="channelStatus" type="radio" value="Protected">Protected &#128273<br>
    <input id="channelName" name="channelName" type="text" placeholder="channelName">
    <button type="submit">createChannel</button>
  </form>
  <br>
{/if}
