
<script lang="ts">
    export const title = 'Mon titre';

    import axios from "axios";
    import { onMount } from "svelte";
    import type { User } from "./types";
    import { setContext } from 'svelte'
    //import groupe from "../../icons/groupe.png"'
    import channelIcon  from './assets/whiteChannel.png';
    import homeIcon     from './assets/whiteHome.png'
    import messageIcon  from './assets/whiteChat.png'
    import gameIcon     from './assets/whiteGame.png'
    import Router from "svelte-spa-router";
    import Users from "./routes/Users.svelte";
    import Leaderboard from "./routes/Leaderboard.svelte";
    import UserCrud from "./routes/UserCRUD.svelte";
    import Channels from "./routes/Channels.svelte";
    import Chat from "./routes/chat/Chat.svelte";
    import Profil from "./routes/Profil.svelte";


    let user: User;

    let groupeImage = "../assets/groupe.png"

    const menuItems = [
      { label: 'Home', icon: homeIcon, link: '#/Menu' },
      { label: 'Channel', icon: channelIcon, link: '#/Channel' },
      { label: 'Messages', icon: messageIcon, link: '#/Message' },
      { label: 'Game', icon: gameIcon, link: '#/Game' }
    ];

    onMount(async () => {
      try {
          const response = await axios.get('http://localhost:3000/auth/whoami', {
              withCredentials: true
            });
            user = response.data;
            console.log(user);
            console.log(user.id);
            setContext('user', user)
      } catch (error) {
        console.error(error);
      }
    });


  </script>

    <div class="menu">
      <a class= testLink href="#/profil">
        {#if user}
            <img class="w-10 h-10 rounded-full" src='http://localhost:3000/images/actual/{user.id}' alt="Rounded avatar">
        {/if}
      </a>

      {#each menuItems as item, i}
      <a href={item.link}>

        <img class="menu-item-image" src={item.icon} alt={item.label} />
      </a>
      {/each}
    </div>


    <!-- <div class="container m-0"> -->
        <Router  routes={{
            '/profil': Profil,
            '/Users/:name': Users,
            '/Leaderboard': Leaderboard,
            '/UserCRUD': UserCrud,
            '/channel': Channels,
            '/Chat': Chat,
        }}/>
    <!-- </div> -->

  <style>

    .menu {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 88px;
      background-color: #f2f2f2;
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