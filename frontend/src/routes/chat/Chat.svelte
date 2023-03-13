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
  let channelName = '';
  let channelsList: string[] = [];
  let channels: Channel[] = [];

  onMount(() => {

    socket.on('recPost', (post: Post) => {
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

    socket.on('Error', (res) => {
      console.log(res);
    });
  })

  function sendMessage() {
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
<ul>
  {#each channel.posts as post}
  <li><b>{post.author}</b>: {post.content}</li>
  {/each}
</ul>
{/each}

<form on:submit|preventDefault={sendMessage}>
  <input type="text" bind:value={channelName} placeholder="channel id">
  <input type="text" bind:value={textfield} placeholder="type your message">
  <button type="submit">send</button>
</form>

<style>
</style>
