
<script lang="ts">
    export const title = 'Mon titre';

    import axios from './axios.config'
    import { onMount, setContext } from "svelte";
    import channelIcon  from './assets/whiteChannel.png';
    import homeIcon     from './assets/whiteHome.png'
    import messageIcon  from './assets/whiteChat.png'
    import gameIcon     from './assets/whiteGame.png'
    import leaderIcon     from './assets/podium.png'
    import { id, logged, user, reloadImage} from "./stores";
    import routes from "./routes";
    import Router, { link } from "svelte-spa-router";
    import Signup from "./routes/Signup.svelte";
    import Login from "./routes/Login.svelte";

    const menuItems = [
      { label: 'Home', icon: homeIcon, link: '#/Menu'},
      { label: 'Channel', icon: channelIcon, link: '#/Channel'},
      { label: 'Messages', icon: messageIcon, link: '#/Message' },
      { label: 'Game', icon: gameIcon, link: '#/Game'},
      { label: 'LeaderBoard', icon: leaderIcon, link: '#/leaderboard'}
    ];

    onMount(() => getProfile())

    async function getProfile() {
      try {
        let response = await axios.get('/auth/whoami');
        // let response = await axios.get('/users/gefaivre');
        user.set(response.data)
        console.log($user)
        logged.set('true')
        id.set(response.data.id.toString())
      } catch (error) {
        logged.set('false')
        id.set('0')
      }
    }

</script>

  {#if $logged === 'true'}
  <div class="screen">
    <div class="profileLink">
    {#if $user}
      <a  use:link href="/users/{$user.username}">
        <img class="profilePicture" src='http://localhost:3000/images/actual/{$user.id}/?$reload=${$reloadImage}' alt="profile">
      </a>
    {/if}
    </div>
    <div class="nav">
      {#each menuItems as item}
      <a href={item.link}>
        <img  class="linkButton" src={item.icon} alt={item.label} />
      </a>
      {/each}
    </div>
    <div class="fillSpace">
    </div>

    <div class="routes">
      {#if $user}
        <Router {routes}/>
      {/if}
    </div>
  </div>

  {:else}
    <a href={FT_AUTHORIZE}>Signin with 42</a>
    <br>
    <Signup/>
    <Login/>
  {/if}

  <style>

   :root {
    --lite-lite-lite-grey: #acacac;
    --lite-lite-grey: #888888;
    --lite-grey: #707070;
    --grey: #222222;
    --black: black;
    --white: white;
    --pink: rgb(255, 88, 171);
    --imageRadius: 50%;
   }

  .screen {
    display: grid;
    height: 100vh;
    grid-template-columns: 90px 1fr;
    grid-template-rows: 90px 1fr 90px;
  }


  .profileLink {
    grid-column: 1/2;
    grid-row: 1/2;
    background-color: var(--grey);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .profileLink .profilePicture {
    height: 50px;
    width: 50px;
    border-radius: var(--imageRadius);
  }

  .profileLink .profilePicture:hover {
    transform: scale(1.10);
    overflow: hidden;
  }

  .nav {
    grid-column: 1/2;
    grid-row: 2/3;
    background-color: var(--grey);
    display: flex;
    row-gap: 35px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .nav .linkButton {
    height: 50px;
    width: 50px;
  }

  .nav .linkButton:hover {
    transform: scale(1.10);
    overflow: hidden;
  }

  .fillSpace {
    grid-column: 1/2;
    grid-row: 3/4;
    background-color: var(--grey);
  }

  .routes {
    grid-column: 2 / 3;
    grid-row: 1 /4;
  }

</style>