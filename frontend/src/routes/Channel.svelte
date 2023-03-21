<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import Layout from "./Layout.svelte";

  </script>

  <style>
  .toDo {
    width: 400px;
    height: 500px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
 </style>

 <Layout>
    <div class=toDo >
        <ul>To do: <ul>
            <li>sidebar avec toute les channels</li>
            <li>conteneur qui met les posts</li>
            <li>sidebar avec les users?</li>
            <li>ou alors les friends ici</li>
    </div>
 </Layout>