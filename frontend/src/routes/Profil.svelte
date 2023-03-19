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

    }
</style>

<Layout>
    <p class='todo'>
       todo:
       <li>
        statistics
         </li>
        <li>

            change avatar, username...

        </li>
        <a href='#/test'>testDaisyUI</a>
        fsdfsfsfs
        <br>
        {#if user}
    Bienvenue, {user.username}!
        {/if}

    </p>
</Layout>
