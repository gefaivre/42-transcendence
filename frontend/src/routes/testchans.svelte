<script lang=ts>
    import Layout from "./Layout.svelte";
    import axios from "../axios.config";
    import { onMount, onDestroy, afterUpdate} from "svelte";
    import ChanMenu from "./chanLayouts.svelte";
    import settingsImage from "../assets/settings.png";
    import { logged, id } from "../stores";
    import { pop } from "svelte-spa-router";
    import ioClient from 'socket.io-client';
    import type { Socket } from "socket.io-client";
    import type { Channel, PostEmitDto, ChannelDto, WsException, newPostEmitDto } from "../types";
    import defaultAvatar from '../assets/008-utilisateur.png';
    
    export let params: any = {}
    let socket: Socket = null
    let message: string = ''
    let password: string = ''
    let channel: Channel = null
    let isMember: boolean = false
    let posts: newPostEmitDto[] = []
    let element;
    let showMember: boolean = false;

  // $: foo = posts
  afterUpdate(() => {
		console.log("afterUpdate");
		if(posts) newscrollToBottom(element);
        if (channel && params && params.name != channel.name)
            location.reload();

  });
	
	$: if(posts && element) {
		console.log("tick");
		newscrollToBottom(element);
	}

    function listofmember()
    {
        if (showMember)
            showMember = false;
        else
            showMember = true;
        console.log(showMember);
    }
  function post() {
    socket.emit('sendPost', {
      content: message,
      channelName: channel.name,
    }, (response: string) => {
      console.log(response)
      message = ''
    })
  }

  function joinRoom() {
    socket.emit('joinRoom', channel.name, (response: string) => {
      console.log(response)
    })
  }

  function joinChannel() {
      socket.emit('joinChannel', {
        channelName: channel.name,
        status: channel.status,
        password: password
      } as ChannelDto, (response: string) => {
        console.log(response)
        joinRoom()
      })
  }

  function leaveChannel() {
    socket.emit('leaveChannel', channel.name, (response: string) => {
      console.log(response)
      return pop()
    })
  }
  function getAvatar(username) {
    let user = channel.users.find(user => user.username === username);
    if (user)
      return "http://localhost:3000/images/actual/" + user.id;
      else
       return defaultAvatar;
  }
  function scrollToBottom() {
    const el = document.getElementById('Wall');
    el.scrollTop = el.scrollHeight;
}
const newscrollToBottom = async (node) => {
    if (node)
        node.scroll({ top: node.scrollHeight, behavior: 'smooth' });
  }; 

  // TODO: what if we manually change `id` store value ?
  onMount(async () => {

    channel = (await axios.get(`/channel/${params.name}`)).data

    socket = ioClient('http://localhost:3000', {
      path: '/chat',
      withCredentials: true
    })

    if (channel && channel.users && channel.users.find(user => user.id.toString() === $id))
      joinRoom()
    else {
      if (!confirm('Join this channel ?'))
        return await pop()
      if (channel.status === 'Protected') {
        password = prompt('Enter password')
        if (password === '')
          console.error(`Unable to join channel ${channel.name}: Empty password.`)
        if (!password)
          return await pop()
      }
      joinChannel()
    }

    isMember = true

    socket.on('connect', () => {
      console.log('Connected')
    })

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason)
    })

    socket.on('post', (post: newPostEmitDto) => {
      console.log('receive post')
      posts.push(post)
      posts = posts
    })

    // TODO: would be nice to pop _only_ when exception doesn't come from a post failure
    socket.on('exception', (e: WsException) => {
      console.error(e)
      return pop()
    })

    // TODO: is it used ?
    socket.on('error', (e) => {
      console.error(e)
      return pop()
    })

    socket.on('channelEvent', (event: any) => {
      if (event.event === 'join')
        console.log(event.user, 'joined the chanel')
      else if (event.event === 'leave')
        console.log(event.user, 'left the chanel')
    })
    console.log(channel.users)

  })//fin

  onDestroy(() => socket.disconnect())
  function testlink()
  {
    console.log("bouton settings");
    window.location.href="/#/testchan/tesr"
  }
  </script>
{#if channel}
<Layout>
    <ChanMenu>
    </ChanMenu>
    <div class="horizontalBar">
        <h1>{channel.name}</h1>
        <div class="settings">
            <img src={settingsImage} alt="settings wheel" on:click={listofmember}>
        </div>
        <button on:click={() => location.reload()}>Actualiser</button>


    </div>
    <div class="Wall" id="Wall" bind:this={element}>
       
      {#each posts as post}
      <div class="post">
        <div class="marge">
          <img class="rounded-full" src={getAvatar(post.author)} style="height: 30px; width: 30px;" alt="avatar">
        </div>
        <div class="user">
          <span style="color: #9E27D9; font-size: 20px; position: relative; top:30%; font-family: Arial;">
            {post.author}
            
          </span>
        </div>
        <div class="postContent">
          <span style="color: #FFFFFF; font-family: Arial;">
            {post.content}

          </span>

        </div>
        <br>
      </div>
      {/each}
    </div>
    <div class="prompt">
        <form on:submit|preventDefault={post}>
            <label for="chat" class="sr-only">Your message</label>
            <textarea id="chat" bind:value={message} rows="1" class="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
            <button type="submit" class="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-white">
              <svg aria-hidden="true" class="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
              <span class="sr-only">Send message</span>
            </button>
          </form> 
    </div>
    {#if showMember}
<div class="settingscard">


    <div class="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 rounded-t-lg bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800" id="defaultTab" data-tabs-toggle="#defaultTabContent" role="tablist">
            <li class="mr-2">
                <button id="about-tab" data-tabs-target="#about" type="button" role="tab" aria-controls="about" aria-selected="true" class="inline-block p-4 text-blue-600 rounded-tl-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-blue-500">About</button>
            </li>
            <li class="mr-2">
                <button id="services-tab" data-tabs-target="#services" type="button" role="tab" aria-controls="services" aria-selected="false" class="inline-block p-4 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300">Services</button>
            </li>
            <li class="mr-2">
                <button id="statistics-tab" data-tabs-target="#statistics" type="button" role="tab" aria-controls="statistics" aria-selected="false" class="inline-block p-4 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300">Facts</button>
            </li>
        </ul>
        <div id="defaultTabContent">
            <div class="hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="about" role="tabpanel" aria-labelledby="about-tab">
                <h2 class="mb-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Powering innovation & trust at 200,000+ companies worldwide</h2>
                <p class="mb-3 text-gray-500 dark:text-gray-400">Empower Developers, IT Ops, and business teams to collaborate at high velocity. Respond to changes and deliver great customer and employee service experiences fast.</p>
                <a href="test.com" class="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-700">
                    Learn more
                    <svg class="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
                </a>
            </div>
            <div class="hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="services" role="tabpanel" aria-labelledby="services-tab">
                <h2 class="mb-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">We invest in the world’s potential</h2>
                <!-- List -->
                <ul class="space-y-4 text-gray-500 dark:text-gray-400">
                    <li class="flex space-x-2">
                        <!-- Icon -->
                        <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                        <span class="leading-tight">Dynamic reports and dashboards</span>
                    </li>
                    <li class="flex space-x-2">
                        <!-- Icon -->
                        <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                        <span class="leading-tight">Templates for everyone</span>
                    </li>
                    <li class="flex space-x-2">
                        <!-- Icon -->
                        <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                        <span class="leading-tight">Development workflow</span>
                    </li>
                    <li class="flex space-x-2">
                        <!-- Icon -->
                        <svg class="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                        <span class="leading-tight">Limitless business automation</span>
                    </li>
                </ul>
            </div>
            <div class="hidden p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800" id="statistics" role="tabpanel" aria-labelledby="statistics-tab">
                <dl class="grid max-w-screen-xl grid-cols-2 gap-8 p-4 mx-auto text-gray-900 sm:grid-cols-3 xl:grid-cols-6 dark:text-white sm:p-8">
                    <div class="flex flex-col">
                        <dt class="mb-2 text-3xl font-extrabold">73M+</dt>
                        <dd class="text-gray-500 dark:text-gray-400">Developers</dd>
                    </div>
                    <div class="flex flex-col">
                        <dt class="mb-2 text-3xl font-extrabold">100M+</dt>
                        <dd class="text-gray-500 dark:text-gray-400">Public repositories</dd>
                    </div>
                    <div class="flex flex-col">
                        <dt class="mb-2 text-3xl font-extrabold">1000s</dt>
                        <dd class="text-gray-500 dark:text-gray-400">Open source projects</dd>
                    </div>
                </dl>
            </div>
        </div>
    </div>
</div>
{/if}

</Layout>
{:else}
    <p>404 channel not found</p>
{/if}

<style>
    .Wall{
        height: calc(100% - 156px);
        width: calc(100% - 448px);
        position: absolute;
        left: 448px;
        top: 56px;
        overflow-y: auto;
      }
      .Wall img{
        height: 30px;
        widows: 30px;
      }
      .post {
      padding: 10px;
      margin: 5px;
      border-radius: 5px;
      max-height: 100%;
      max-width: 100%;
      overflow-y: auto;
      word-wrap: break-word;
      position: relative;
}
      .post .user {
        position: absolute;
        top: 0;
        left: 45px;
        font-weight: bold;
        margin-bottom: 5px;
        z-index: 1;
      }
    .post .postContent{
      position: absolute;
      width: calc(100% - 44px);
      max-height: 100%;
      left:45px;
      overflow-y: auto;
      word-wrap: break-word;
      position: relative;
      z-index: 2;
      padding-top: 15px;
      text-align-last: left;
    }
      .marge{
        position: absolute;
        top:0px;
        left:0px;

        height:100%;
        width:45px;
      }
    .prompt{
        position: absolute;
        width: calc(100% - 448px);
        height: 100px;
        bottom: 0px;
        left: 448px;

    }
    .prompt form {
  display: flex;
  justify-content: space-between;
}
.prompt button[type="submit"] {
  width: 100px;
}
.prompt button svg {
  width: 40px;
  height: 40px;
}

    .horizontalBar{
        height: 56px;
        width: calc(100% - 448px);
        position: absolute;
        left: 448px;
        top: 0px;
        background-color: goldenrod;
    }
    .horizontalBar .settings{
        position: absolute;
        right : 5%;
        top :5%;
        height: 50px;
        width: 50px;
    }

    h1{
        position: absolute;
        left : 2%;
        top: 20%;
        color : #9E27D9;
        font-size: 25px;
    }
    .settings img{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .settingscard{
      position: absolute;
      left: 50%;
      top:50%;
      height: 300px;
      width:300px;
    }
</style>