<script>
    // définir les boutons du menu

    import axios from "../axios.config";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import Layout from "./Layout.svelte";
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