<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import { getCookie, deleteCookie } from 'svelte-cookie';
    import { logged } from "../stores";

    let jwt: string = getCookie('jwt')
    let profile = { username: '', userId: '' }

    onMount(() => {
        if (jwt) {
            logged.update(() => true)
            getProfile()
        } else {
            logged.update(() => false)
            resetProfile()
        }
    })

    function getProfile() {
        axios.get('http://localhost:3000/profile', {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        .then((res) => { profile = res.data })
        .catch((err) => { console.log(err) })
    }

    function resetProfile() {
        profile.username = ''
        profile.userId = ''
    }

    function logout() {
        logged.update(() => false)
        deleteCookie('jwt')
    }

</script>

<main>
    {#if $logged}
        <h1 class="zoom">Transcendence</h1>
        <br>
        <a href="#/usercrud">User CRUD</a>
        <br>
        <a href="#/leaderboard">Leaderboard</a>
        <br>
        <a href="#/chat">chatroom</a>
        <br>
        <br>
        <button on:click={logout}>logout</button>
        <br>
        <br>
        <p>You successfully authenticated as <b>{profile.username}</b></p>
        <br>
        <p>Your jwt is:</p>
        <p class="break">{jwt}</p>
    {:else}
        <a href={FT_AUTHORIZE} style="font-size: 30px;">Signup with 42</a>
    {/if}
</main>

<style>


    * {
		padding: 0em;
        margin: 0%;
    }

	main {
		text-align: center;
		margin: 0px;
        padding: 0px;
        color: #fff;
        background-color: black;

	}

    @keyframes pulsate {

    100% {

        text-shadow:
        0 0 4px #fff,
        0 0 11px #fff,
        0 0 19px #fff,
        0 0 40px #f09,
        0 0 80px #f09,
        0 0 90px #f09,
        0 0 100px #f09,
        0 0 150px #f09;

    }

    0% {

      text-shadow:
      0 0 4px #fff,
      0 0 10px #fff,
      0 0 18px #fff,
      0 0 38px #f09,
      0 0 73px #f09,
      0 0 80px #f09,
      0 0 94px #f09,
      0 0 140px #f09;

      }
    }

    .zoom {
        transition: transform .3s;
    }

    .zoom:hover {
        transform: scale(1.2);
    }


    h1 {
        display: absolute;
        margin-left: auto;
        margin-right: auto;
        animation: pulsate 1s ease-in-out infinite alternate;
    }

</style>

