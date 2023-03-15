<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { getCookie, deleteCookie } from 'svelte-cookie';
    import { logged } from "../stores";
    import Layout from "./Layout.svelte";
  
  </script>
  
  <style>
  .toDo {
    width: 400px;
    height: 500px;
  }
 </style>

 <Layout>
    <div class=toDo >
        <ul>To do: <ul>
            <p>The game mdr</p>
    </div>
 </Layout>