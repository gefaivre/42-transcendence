<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { getCookie, deleteCookie } from 'svelte-cookie';
    import { logged } from "../stores";
    //import groupe from "../../icons/groupe.png"'
    import channelIcon  from '../assets/whiteChannel.png';
    import homeIcon     from '../assets/whiteHome.png'
    import messageIcon  from '../assets/whiteChat.png'
    import gameIcon     from '../assets/whiteGame.png'
    import colorAvar    from '../assets/colorAvatar.png'


    let groupeImage = "../assets/groupe.png"

    const menuItems = [
      { label: 'Home', icon: homeIcon, link: '#/Menu' },
      { label: 'Channel', icon: channelIcon, link: '#/Channel' },
      { label: 'Messages', icon: messageIcon, link: '#/Message' },
      { label: 'Game', icon: gameIcon, link: '#/Game' }
    ];
  
    // fonction pour gérer la sélection d'un bouton du menu
    function selectMenuItem(index) {
      console.log(`Bouton ${index} sélectionné`);
      // ajouter le code pour gérer la sélection du bouton ici
    }
    function handleClick() {
    console.log("Le bouton a été cliqué !");}
    
  </script>
  
  <style>
    /* style pour le menu */
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
    .menu button {
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

  .button {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
    background-color: #222222;
  }
  
  .button img {
    display: block;
    height: 100px;
    width: 100px;
  }

  .testLink {
    position: fixed;
    top: 30%;
    left: 30%;
  }
  .profilLink
  {
    display: block;
    height: 100px;
    width: 100px; 
    
  }


  </style>

<div class="testLink">
   <a href = "#/profil">
    <img class="profilLink" src={colorAvar} alt='profil'/>
  </a>
</div>

<div class="menu">
  {#each menuItems as item, i}
    <a href={item.link}>
     
        <img class="menu-item-image" src={item.icon} alt={item.label} />
    </a>
  {/each}
</div>



<button class="button" on:click={handleClick}>
  <img src={channelIcon} alt="Mon imaghgge" />
</button>

  
