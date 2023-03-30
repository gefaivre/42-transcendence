<script lang="ts">

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import type { User } from "../types";

    // TODO: get rid of unused `User` fields (i.e. `id`, `password` and `ft_login`)
    let users: User[] = [];

    onMount(() => getUsers());

    async function getUsers () {
      try {
        users = (await axios.get(`http://localhost:3000/users`, { withCredentials: true })).data
        console.log(users)
        sortByMMR()
      } catch (error) {
        console.log(error.response.data.messsage)
      }
    }

    function sortByMMR () {
      users.sort((a,b) => b.mmr - a.mmr)
      users = users // svelte reload
    }

    function sortByGames () {
      users.sort((a,b) => b.games - a.games)
      users = users // svelte relaod
    }

</script>

{#if $logged === 'true'}
    <h1>--LeaderBord--</h1>

    <table class="leaderboard">
        <thead>
            <tr>
                <th colspan="4">The big leaderboard</th>
            </tr>
            <tr>
                <td>Rank</td>
                <td>Username</td>
                <td><a class="clickable" href="/#/leaderboard" on:click={() => sortByMMR()}>Mmr</a></td>
                <td><a class="clickable" href="/#/leaderboard" on:click={() => sortByGames()}>Games</a></td>
            </tr>
        </thead>
        <tbody>
            {#each users as user, i}
            <tr>
                <td>{i + 1}</td>
                <td class="username" ><a href="#/users/{user.username}">{user.username}</a></td>
                <td>{user.mmr}</td>
                <td>{user.games}</td>
            </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

<style>

    tbody tr:nth-child(1) > td:nth-child(1) {
        background-color: gold;
    }

    tbody tr:nth-child(2) td:nth-child(1) {
        background-color: silver;
    }

    tbody tr:nth-child(3) td:nth-child(1) {
        background-color: sienna;
    }

    .clickable {
        color: white;
    }

    .leaderboard {
        margin: auto;
    }

    .username {
        text-align:left;
    }

</style>