<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import Layout from "./Layout.svelte";

    export let user;
    console.log(user);

  </script>

  <style>
  .toDo {
    width: 400px;
    height: 500px;
  }
 </style>

    <div class=toDo >
        <ul>To do: <ul>
            <p>The game mdr</p>
    </div>