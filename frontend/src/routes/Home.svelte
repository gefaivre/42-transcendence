<script lang="ts">
    import axios from "axios";
    import { onMount } from "svelte";
    import { id, logged } from "../stores";
    import type { User } from '../types'

    let user: User = {
        username: '',
        password: '',
        mmr: 0,
        games: 0,
        ft_login: '',
        id : 0,
        TwoFA: null,
        friends: [],
        friendOf: [],
        pendingFriends: [],
        requestFriends: [],
    }

    onMount(() => getProfile())

    async function getProfile() {
      try {
        let response = await axios.get('http://localhost:3000/auth/profile', { withCredentials: true })
        user = response.data
        logged.set('true')
        id.set(response.data.id.toString())
        response = await axios.get(`http://localhost:3000/users/id/${user.id}`, { withCredentials: true })
        user = response.data
      } catch (error) {
        logged.set('false')
        id.set('0')
      }
    }

    async function logout() {
      try {
        await axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
        logged.set('false')
        id.set('0')
      } catch (error) {
        console.log(error)
      }
    }

</script>

<main>
    {#if $logged === 'true'}
        <h1 class="zoom">Transcendence</h1>
        <br>
        <a href="#/usercrud">User CRUD</a>
        <br>
        <a href="#/channels">Channels</a>
        <br>
        <a href="#/leaderboard">Leaderboard</a>
        <br>
        <a href="#/chat">chatroom</a>
        <br>
        <a href="#/Menu">testfront</a>
        <br>
        <a href="#/pong">pong</a>
        <br>
        <button on:click={logout}>logout</button>
        <br>
        <br>
        <p>You successfully authenticated as <a href="#/users/{user.username}">{user.username}</a></p>
    {:else}
        <a href={FT_AUTHORIZE} style="font-size: 30px;">Signin with 42</a>
        <br>
        <br>
        <a href="#/signup" style="font-size: 30px;">Signup with username</a>
        <br>
        <br>
        <a href="#/login" style="font-size: 30px;">Login with username</a>
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

