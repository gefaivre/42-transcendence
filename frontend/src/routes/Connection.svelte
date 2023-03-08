<script lang="ts">
    import { getCookie, deleteCookie } from 'svelte-cookie';
    import { onMount } from "svelte";
    import axios from "axios";

    let profile = {
        username: String,
        userId: String
    }
    let logged: boolean = false
    let jwt: string = getCookie('jwt')

    onMount(() => {
        axios.get('http://localhost:3000/profile', {
            headers : {
                Authorization: 'Bearer ' + jwt
            }
        })
        .then((res) => {
            logged = true
            profile = res.data
        })
        .catch((err) => { console.log(err) })
    })

    function logout() {
        logged = false
        deleteCookie('jwt')
    }

</script>

<main>

    <a href={FT_AUTHORIZE}> <button>signin(42)</button> </a>
    <button on:click={logout}>logout</button>
    <br>
    {#if logged}
        <p>You successfully authenticated as <b>{profile.username}</b></p>
        <br>
        <p>Your jwt is: </p>
        <p class="break">{jwt}</p>
    {:else}
        <p>You not already authenticated...</p>
    {/if}

</main>


<style>
    main {
        text-align: center;
		padding: 1em;
		margin: 0 auto;
    }
    .break {
        text-align: center;
        word-break: break-all;
    }
</style>
