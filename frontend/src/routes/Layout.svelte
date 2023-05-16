
<script lang="ts">
  export const title = 'Mon titre';

  import axios from "axios";
  import { onMount } from "svelte";
  import type { User } from "../types";
  //import groupe from "../../icons/groupe.png"'
  import channelIcon  from '../assets/whiteChannel.png';
  import homeIcon     from '../assets/whiteHome.png'
  import messageIcon  from '../assets/whiteChat.png'
  import gameIcon     from '../assets/whiteGame.png'


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
    } catch (error) {
      console.error(error);
    }
  });


</script>

  <div class="menu">
    <a class= testLink href = "#/profil">
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


  <div class="container m-0">
    <slot></slot>
  </div>

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
  .container {
    background-color: black;
    height: 100vh;
    max-width: 100%;
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