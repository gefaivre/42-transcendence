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
      content: string;
      channelId: number;
    }
    
  let posts: Post[] = [];
  let textfield = '';
  let channelIdString = '';

  onMount(() => {
        socket.emit('getPosts', {}, (res : Post[]) => {
          posts = [...res]
          })
    })
  socket.on('recPost', (post: Post) => {
      posts = [...posts, post]
    });

  socket.on('Error', (res) => {
    console.log(res);
  });

  function sendMessage() {
      const post = textfield.trim();
      if (!post)
        return;
      let toSend: Post = { content: textfield, channelId: parseInt(channelIdString)};
      console.log(toSend);
      socket.emit('sendPost', toSend)
    }
</script>

<h2>Test de chatRoom</h2>
<p>liste des messages</p>
<ul>
{#each posts as post}
<li>{post.channelId.toString()}: {post.content}</li>
{/each}
</ul>

<form on:submit|preventDefault={sendMessage}>
  <input type="text" bind:value={channelIdString} placeholder="channel id">
  <input type="text" bind:value={textfield} placeholder="type your message">
  <button type="submit">send</button>
</form>

<style>
</style>
