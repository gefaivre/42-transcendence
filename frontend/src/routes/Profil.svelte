<script>
    import Layout from "./Layout.svelte";
    import axios from "axios";
    import { onMount } from "svelte";
    import greenWin from '../assets/greenWin.png'
    import redLose from "../assets/redLose.png"
    let user = null;

    onMount(async () => {
        try {
          const response = await axios.get('http://localhost:3000/channel/me/myself/andI', {
            withCredentials: true
        });
             user = response.data;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style>
    .rectangle {
  position: fixed;
  top: 0;
  left: 88px;
  width: 25%;
  height: 100%;
  background-color: black;
  z-index: 1;
  border-right: 1px solid #707070;
  border-left: 1px solid #707070;

    }
    .ftbigAvatar{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;

    }
    .ftbigAvatar img{
        position: absolute;
        width: 100%;
        height: 100%;
    }
    .username{
        position: absolute;
        top: 75%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 50px;
    }
    .gameHistory {
        position: fixed;
        top: 180px;
        left: 525px;
        width: 25%;
        height: 70%;
        background-color: black;
        z-index: 1;
        border-right: 1px solid #707070;
        border-left: 1px solid #707070;
        border-top: 1px solid #707070;
        border-bottom: 1px solid #707070;
        border-radius: 5%;
    }
    .gameHistory h1{
        margin-left: 20px;
        margin-top: 20px;
    }
    .statistics{
        position: fixed;
        display: flex;
        flex-direction: column; 
        bottom: 152px;
        right: 100px;
        width: 412px;
        height: 225px;
        border: 1px solid #707070;
        border-radius: 30px;
        opacity: 1;
        z-index: 1;
    }
    .statistics h1{
        margin-left: 5%;
        margin-top: 20px;
    }
    .statistics h2{
        margin-left: 15%;
        margin-top: 20px;
    }
    .statistics .flex {
    width: 100%;
    margin: 10px 0;
    justify-content: center;
    align-items: center;
}
.statistics .flex img {
    width: 20px;
    height: auto;
}
.statistics .flex h2 {
    margin-left: 10px;
}

</style>

<Layout>
    <div class="rectangle">
        <h1 class="text-5xl font-extrabold text-pink-500 text-center">Profil</h1>
        <div class="ftbigAvatar">
            <img class="rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar">
        </div>
        {#if user}
        <div class="username">
            <div class="text-4xl text-white text-center font-inter">{user.username}</div>
        </div>
        {/if}
    </div>
    <div class="gameHistory">
        <h1 class="text-4xl text-purple-800 font-inter">Game History</h1>
    </div>
    {#if user}
    <div class="statistics">
        <div class="statistics">
            <h1 class="text-4xl text-purple-800 font-inter">Statistics</h1>
            <div class="flex mt-2 items-center">
                <img src={greenWin} alt="Victory" class="h-6 mr-2 ml-2">
                <h2 class="text-xl text-white font-inter">Victories:</h2>
                <span class="text-white ml-2">{user.wins.length}</span>
            </div>
            
            <div class="flex items-center">
                <img src={redLose} alt="Defeat" class="h-6 mr-2 ml-2">
                <h2 class="text-xl text-white font-inter">Losses:</h2>
                <span class="text-white ml-2">{user.loses.length}</span>
            </div>
            
            <div class="flex items-center" style="width: 80px;">
                <h2 class="text-2xl text-white font-inter">Ratio:</h2>
                <span class="text-white ml-2">{user.wins.length / user.loses.length }</span>
            </div>
            
            
        </div>
        
    </div>
    {/if}
    
    
</Layout>
<h1 class="text-5xl text-purple-800 text-center font-inter">Profil</h1>
