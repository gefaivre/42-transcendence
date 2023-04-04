<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import Layout from "./Layout.svelte";
    import ChanMenu from "./chanLayouts.svelte";

  </script>

  <style>
  .toDo {
    width: 400px;
    height: 500px;
    background-color: aliceblue;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
 </style>

 <Layout>
    <ChanMenu>
    </ChanMenu>
    <div class=toDo >
        <ul>To do: <ul>
            <li>messagerie</li>
            <li>peut etre les channels au final a voir </li>
            <li>dqns ce cqs quid des messqges?</li>
            <div class="bg-red-500">Hello World</div>
    </div>
 </Layout>