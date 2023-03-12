<script lang="ts">

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";

    let user = { username: '', userId: '' }

    onMount(() => login())

    function login() {
        axios.get('http://localhost:3000/auth/login', {
            withCredentials: true
        })
        .then((res) => {
            user = res.data
            logged.set('true')
        })
        .catch((err) => {
            console.log(err)
            user.username = ''
            user.userId = ''
            logged.set('false')
        })
    }

    function logout() {
        axios.get('http://localhost:3000/auth/logout', {
            withCredentials: true
        })
        .then(() => logged.set('false'))
        .catch((err) => console.log(err))
    }

</script>

<main>
    {#if $logged === 'true'}
        <h1 class="zoom">Transcendence</h1>
        <br>
        <a href="#/usercrud">User CRUD</a>
        <br>
        <a href="#/leaderboard">Leaderboard</a>
        <br>
        <br>
        <button on:click={logout}>logout</button>
        <br>
        <br>
        <p>You successfully authenticated as <b>{user.username}</b></p>
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

