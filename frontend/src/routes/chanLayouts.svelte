<script>
    // définir les boutons du menu

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    
    function redirectTo() {
    window.location.href = '/#/message/create';
  }

  </script>

  <style>
  .channelsMenu {
  position: fixed;
  top: 0;
  left: 88px;
  width: 360px;
  height: 100%;
  background-color: #222222;
  z-index: 1;
  border-right: 1px solid #707070;
  border-left: 1px solid #707070;
  }
  .channelsMenu .createChan{
    position: absolute;
    bottom: 5%;
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
  }
 </style>

<div class="channelsMenu">
    <h1 class="text-5xl text-center font-inter"style="color: #9E27D9;">Channels</h1>
    <div class="createChan">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" on:click={() => redirectTo()}>
        CREATE +</button>
    </div>
  </div>