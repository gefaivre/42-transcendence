<script lang="ts">
  import axios from 'axios'
  import  ioClient  from 'socket.io-client';
  import { onMount } from "svelte";
  import { logged } from '../../stores';
  import type { ChannelStatus, ChannelDto } from '../../types';

  const socket = ioClient('http://localhost:3000', {
    path: '/chat',
    withCredentials: true
  });

  class Post {
      author: string;
      content: string;
      channelName: string;
    }

  class Channel {
    name: string;
    posts: Post[];
    joined: boolean;
    status: string;
  }

  let channels: Channel[] = [];

  onMount(() => {
    axios.get('http://localhost:3000/channel', { withCredentials: true })
    .then(channelList => {
      console.log('channel list', channelList);
      for (const channel of channelList.data)
        channels.push({name: channel.name, posts: [], joined: false, status: channel.status});
      channels = channels;
    });

    socket.on('post', (post: Post) => {
      console.log('post', post);  
      const channel = channels.find(channel => channel.name === post.channelName);
      if (channel)
        channel.posts.push(post);
      channels = channels;
    });

    socket.on('join', payload => {
      console.log('join', payload);
      const chan = channels.find(channel => channel.name === payload.channelName);
      if (chan) {
        chan.joined = true;
        channels = channels;
      }
    });

    socket.on('leave', payload => {
      console.log('leave', payload);
      const chan = channels.find(channel => channel.name === payload.channelName);
      if (chan) {
        chan.joined = false;
        channels = channels;
      }
    });

    socket.on('error', payload => {
      console.log(payload);
    });

  });

  function leaveChannel(channelName: string) {
    socket.emit('leaveChannel', { channelName: channelName });
  }

  function joinChannel(channelName: string) {
    socket.emit('joinChannel', { channelName: channelName });
  }

  function createChannel(event) {
    const formData = new FormData(event.target);

    if (formData.get('channelName') === '')
      return alert('Empty name')

    if (formData.has('channelStatus') === false)
      return alert('Empty status')

    if (formData.get('channelStatus') === 'Protected') {
      var pass: string = window.prompt('Enter password');
      if (!pass) return alert('Empty password')
    } else {
      pass = ''
    }

    let channel: ChannelDto = {
      channelName: formData.get('channelName') as string,
      status: formData.get('channelStatus') as ChannelStatus,
      password: pass
    }

    axios.post('http://localhost:3000/channel', channel, { withCredentials: true });
  }

  function sendMessage(channelName: string, event) {
    const formData = new FormData(event.target);

    for (let field of formData) {
      const [key, value] = field;
      if (key === 'textfield') {
        socket.emit('sendPost', { content: value, channelName: channelName });
      }
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
  <button on:click={() => joinChannel(channel.name)}>join this channel</button>
{/if}

{/each}

  <br>
  <hr class="solid">
  <br>
  <form on:submit|preventDefault={createChannel}>
    <input id="channelStatus" name="channelStatus" type="radio" value="Public">Public &#9989<br>
    <input id="channelStatus" name="channelStatus" type="radio" value="Private">Private &#9940<br>
    <input id="channelStatus" name="channelStatus" type="radio" value="Protected">Protected &#128273<br>
    <input id="channelName" name="channelName" type="text" placeholder="channelName">
    <button type="submit">createChannel</button>
  </form>

{/if}
