<script>
    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    //import groupe from "../../icons/groupe.png"'
    import channelIcon  from '../assets/whiteChannel.png';
    import homeIcon     from '../assets/whiteHome.png'
    import messageIcon  from '../assets/whiteChat.png'
    import gameIcon     from '../assets/whiteGame.png'
    import colorAvatar    from '../assets/payet.jpeg'
    import logo         from '../assets/testPong.png'


    let groupeImage = "../assets/groupe.png"

    const menuItems = [
        { label: 'Home', icon: homeIcon, link: '#/Menu' },
        { label: 'Channel', icon: channelIcon, link: '#/Channel' },
        { label: 'Messages', icon: messageIcon, link: '#/Message' },
        { label: 'Game', icon: gameIcon, link: '#/Game' }
    ];
  </script>
  

  <nav class="bg-gray-800 border-r sm:w-20 w-full h-screen dark:bg-gray-900 dark:border-gray-700">
    <div class="flex items-center justify-center py-2">
      <img src={colorAvatar} alt="Logo" class="w-12 h-12 rounded-full mr-1.25">
    </div>
    <div class="px-4 pb-4">
      <ul class="mt-2 text-gray-600 dark:text-gray-400">
        {#each menuItems as menuItem}
        <li class="menu-item">

            <a href={menuItem.link}>
                <img src={menuItem.icon} alt={menuItem.label} class="w-10 h-10 mr-2">
                
            </a>
        </li>
        {/each}
      </ul>
    </div>
  </nav>

  <style>
    .menu-item:hover {
      background-color: #4D4D4D;
    }
    .menu-item {
        margin-bottom: 10px;
        border: none;
        padding: 10px;
        text-align: center;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>