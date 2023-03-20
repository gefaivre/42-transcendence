<script>
    import Layout from "./Layout.svelte";
    import axios from "axios";
    import { onMount } from "svelte";
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
    .todo{
        background-color: blueviolet;
        height: 220px;
        width: 220px;
        z-index: 1;

    }
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
        top: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 50px;
    }

</style>

<Layout>
    <div class="rectangle">
        <h1 class="text-5xl text-purple-800 text-center font-inter">Profil</h1>
        <h1 class="text-5xl font-extrabold text-pink-500 text-center">Profil</h1>
        <div class="ftbigAvatar">
            <img class="rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="Rounded avatar">
        </div>
        {#if user}
        <div class="username">
            <div class="text-5xl text-white text-center font-inter">{user.username}</div>
            <br>
            <div class="text-4xl text-white text-center font-inter">testsuperlongdscdsc</div>
        </div>
        {/if}
    </div>
    
    <p class='todo'>
        todo:
        <li>
            statistics
        </li>
        <li>
            change avatar, username...
        </li>
        <li>remplacer le lien de l'avatar par un getAvatar dans le script</li>
        <a href='#/test'>testDaisyUI</a>
        fsdfsfsfs
        <br>
        {#if user}
        Bienvenue, {user.username}!
        {/if}
        
    </p>
</Layout>
    