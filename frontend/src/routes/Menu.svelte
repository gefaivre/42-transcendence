<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import logo         from '../assets/testPong.png'
    import Layout from "./Layout.svelte";

    export let user;

    console.log(user);

  </script>

  <style>
  .logo {
    width: 500px;
    height: 500px;
    /*max-width: 100%;
    max-height: 100%;
    margin: auto;
    */
  }
 </style>

  <img class=logo src={logo} alt=pong>