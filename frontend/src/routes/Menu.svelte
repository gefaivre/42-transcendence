<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { getCookie, deleteCookie } from 'svelte-cookie';
    import { logged } from "../stores";
    //import groupe from "../../icons/groupe.png"'
    import logo from '../assets/groupe.png';

    let groupeImage = "../assets/groupe.png"

    const menuItems = [
      { label: 'Accueil', icon: 'home' },
      { label: 'Profil', icon: logo },
      { label: 'Messages', icon: 'message' },
      { label: 'Paramètres', icon: 'settings' }
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
      width: 14%;
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
      background-color: white;
    }
  
    /* style pour les icônes des boutons */
    .menu button i {
      margin-right: 5px;
    }
    .menu button img {
    margin-right: 5px;
    height: 20px;
    width: 20px;
  }

  .menu button .menu-item-image {
    margin-right: 5px;
    height: 20px;
    width: 20px;
  }

  .button {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .button img {
    display: block;
    height: 100px;
    width: 100px;
  }


  </style>


<div class="menu">
  {#each menuItems as item, i}
    <button on:click={() => selectMenuItem(i)}>
      {#if typeof item.icon === 'string'}
        <i class="material-icons">{item.icon}</i>
      {:else}
        <img class="menu-item-image" src={item.icon} alt={item.label} />
      {/if}
      {item.label}
    </button>
  {/each}
</div>



<button class="button" on:click={handleClick}>
  <img src={logo} alt="Mon imaghgge" />
</button>

