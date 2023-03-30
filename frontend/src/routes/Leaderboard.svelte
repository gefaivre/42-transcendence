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
            {#each users as i, y}
            <tr>
                {#if y == 0}
                    <td class="first">{y+1}</td>
                {:else if y == 1}
                    <td class="second">{y+1}</td>
                {:else if y == 2}
                    <td class="third">{y+1}</td>
                {:else}
                    <td>{y+1}</td>
                {/if}
                <td class="username" ><a href="#/users/{i.username}">{i.username}</a></td>
                <td>{i.mmr}</td>
                <td>{i.games}</td>
            </tr>
            {/each}
        </tbody>
    </table>
{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

<style>
    .first {
        background-color: gold;
    }
    .second {
        background-color: silver;
    }

    .third {
        background-color: #8b6c42;
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