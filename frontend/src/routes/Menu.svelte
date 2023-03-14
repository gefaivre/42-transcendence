<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { getCookie, deleteCookie } from 'svelte-cookie';
    import { logged } from "../stores";
    import groupe from "../../icons/groupe.png"

    const menuItems = [
      { label: 'Accueil', icon: 'home' },
      { label: 'Profil', icon: groupe },
      { label: 'Messages', icon: 'message' },
      { label: 'Paramètres', icon: 'settings' }
    ];
  
    // fonction pour gérer la sélection d'un bouton du menu
    function selectMenuItem(index) {
      console.log(`Bouton ${index} sélectionné`);
      // ajouter le code pour gérer la sélection du bouton ici
    }
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
    }
  
    /* style pour les icônes des boutons */
    .menu button i {
      margin-right: 5px;
    }
  </style>
  
  <div class="menu">
    {#each menuItems as item, i}
      <button on:click={() => selectMenuItem(i)}>
        <i class="material-icons">{item.icon}</i>
        {item.label}
      </button>
    {/each}
  </div>
  