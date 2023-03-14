<script lang="ts">
  import  ioClient  from 'socket.io-client';
  import { onMount } from "svelte";
  import { getCookie } from 'svelte-cookie'; 

  let jwt = getCookie('jwt');
  const socket = ioClient('http://localhost:3000', {
    path: '/chat',
    extraHeaders: {
      Authorization: 'Bearer ' + jwt
    }
  });

  class Post {
      author: string;
      content: string;
      channelName: string;
    }

  class PostToSend {
      content: string;
      channelName: string;
  }

  class Channel {
    name: string;
    posts: Post[];
  }
    
  let posts: Post[] = [];
  let textfield = '';
  let channelToJoin = '';
  let channelsList: string[] = [];
  let channels: Channel[] = [];

  onMount(() => {

    socket.on('recPost', (post: Post) => {
      console.log('recPost', post);  
      posts = [...posts, post];
      channelsList = [...channelsList, post.channelName];
      channelsList = [...new Set(channelsList)];
      channelsList.forEach((name) => {
        const chanPosts: Post[] = posts.filter(post => post.channelName === name);
        let chan = channels.find(channel => channel.name === name);
        if (!chan)
          channels = [...channels, { name: name, posts: chanPosts }].sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1: 0));
        else {
          chan.posts = chanPosts;
          channels = [...channels].sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1: 0))
        }
      });
    });

    socket.on('recLeave', (channel) => {
      console.log('recLeave', channel);
    });

    socket.on('recJoin', (channel) => {
      console.log('recJoin', channel);
      channels = [...channels, {name: channel.channelName, posts: []}];
      console.log('channels are now ', channels);
    });
  })

  function leaveChannel(channelName: string) {
    socket.emit('leaveChannel', { channelName: channelName });
    let toRemove = channels.map(channel => channel.name).indexOf(channelName);
    channels.splice(toRemove, 1);
    channels = channels;
    console.log('channels are now ', channels);
  }

  function joinChannel() {
    socket.emit('joinChannel', { channelName: channelToJoin });
  }

  function sendMessage(channelName: string) {
      const post = textfield.trim();
      if (!post)
        return;
      let toSend: PostToSend = { content: textfield, channelName: channelName};
      socket.emit('sendPost', toSend)
  }


</script>

<h1>Chat</h1>
<p>liste des messages</p>
{#each channels as channel}
  <h2>{channel.name}</h2>
  <button on:click={() => leaveChannel(channel.name)}>leave this channel</button>
<ul>
  {#each channel.posts as post}
  <li><b>{post.author}</b>: {post.content}</li>
  {/each}
</ul>
<form on:submit|preventDefault={() => sendMessage(channel.name)}>
  <input type="text" bind:value={textfield} placeholder="type your message">
  <button type="submit">send post</button>
</form>
{/each}

<form on:submit|preventDefault={joinChannel}>
  <input type="text" bind:value={channelToJoin} placeholder="channel name">
  <button type="submit">join Channel</button>
</form>

<style>
</style>
