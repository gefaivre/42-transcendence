<script lang="ts">
    // définir les boutons du menu

    import axios from "../axios.config";
    import { onMount } from "svelte";
    import { logged } from "../stores";

    let chans = [];
    function redirectTo() {
    window.location.href = '/#/message/create';
  }
  onMount(async () => {
    try {
      const response = await axios.get('channel');
      chans = response.data;
      console.log(chans);
    } catch (e) {
      console.error(e);
    }
  });

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
  .channelsMenu .channels{
    position: absolute;
    top:15%;
    width: 100%;
    height: 70%;
    overflow-y: auto;
  }
  .chan {
        margin-bottom: 10px;
        height: 35px;
        width: 100%;
}
.chan span {
    font-size: 20px;
    color: #CDCDCD;
    margin-left: 10px;
}
.chan:hover {
      background-color: #4D4D4D;
    }

 </style>

<div class="channelsMenu">
    <h1 class="text-5xl text-center font-inter"style="color: #9E27D9;">Channels</h1>
    <div class="channels">
        {#each chans as chan }
        <a href={`/#/message/${chan.name}`}>
        <div class ="chan">
                <span>{chan.name}</span>
            </div>
        </a>
        {/each}
    </div>
    <div class="createChan">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded" on:click={() => redirectTo()}>
        CREATE +</button>
    </div>
  </div>