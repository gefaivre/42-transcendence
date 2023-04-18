
<script lang="ts">
    export const title = 'Mon titre';

    import axios from "axios";
    import { onMount, setContext } from "svelte";
    //import groupe from "../../icons/groupe.png"'
    import channelIcon  from './assets/whiteChannel.png';
    import homeIcon     from './assets/whiteHome.png'
    import messageIcon  from './assets/whiteChat.png'
    import gameIcon     from './assets/whiteGame.png'
    import { id, logged, user } from "./stores";
    import routes from "./routes";
    import Router from "svelte-spa-router";

    const menuItems = [
      { label: 'Home', icon: homeIcon, link: '#/Menu'},
      { label: 'Channel', icon: channelIcon, link: '#/Channel'},
      { label: 'Messages', icon: messageIcon, link: '#/Message' },
      { label: 'Game', icon: gameIcon, link: '#/Game'}
    ];

    onMount(() => getProfile())

    async function getProfile() {
      try {
        let response = await axios.get('http://localhost:3000/auth/whoami', {withCredentials: true});
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
    <div class="menu">
      <a  class= testLink href="#/profil">
        {#if $user}
            <img class="w-10 h-10 rounded-full" src='http://localhost:3000/images/actual/{$user.id}' alt="Rounded avatar">
        {/if}
      </a>

      {#each menuItems as item}
      <a href={item.link}>
        <img  class="menu-item-image" src={item.icon} alt={item.label} />
      </a>
      {/each}
    </div>

    <Router {routes}/>

  {:else}
    <a href={FT_AUTHORIZE} style="font-size: 30px;">Signin with 42</a>
    <br>
    <br>
    <a href="#/signup" style="font-size: 30px;">Signup with username</a>
    <br>
    <br>
    <a href="#/login" style="font-size: 30px;">Login with username</a>
  {/if}

  <style>

    .menu {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 88px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #222222;
    }

    /* style pour les boutons du menu */
    .menu a {
      margin-bottom: 10px;
      border: none;
      padding: 10px;
      width: 80%;
      text-align: center;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #222222;
    }

    /* style pour les icônes des boutons */
    .menu a  {
      margin-right: 5px;
    }

    .menu a img {
    margin-right: 5px;
    height: 55px;
    width: 55px;
    }

    .menu a .menu-item-image {
      margin-right: 5px;
      height: 55px;
      width: 55px;
    }

    .testLink {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    }

    .menu a:hover {
      background-color: #4D4D4D;}
      @media (max-width: 768px) {
      .menu {
      width: 50px;
      }

      .menu a img {
      height: 30px;
      width: 30px;
      }
    }

  </style>