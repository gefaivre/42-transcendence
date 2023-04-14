<script lang="ts">

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";

    let tab = [];

    onMount(() => getMmr());

    async function getMmr() {
      try {
        tab = (await axios.get(`http://localhost:3000/leaderboard/mmr`, { withCredentials: true })).data
        console.log(tab)
      } catch (error) {
        console.log(error)
      }
    };

    async function getGames() {
      try {
        tab = (await axios.get(`http://localhost:3000/leaderboard/games`, { withCredentials: true })).data
        console.log(tab)
      } catch (error) {
        console.log(error)
      }
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
                <td><a class="clickable" href="/#/leaderboard" on:click={() => getMmr()}>Mmr</a></td>
                <td><a class="clickable" href="/#/leaderboard" on:click={() => getGames()}>Games</a></td>
            </tr>
        </thead>
        <tbody>
            {#each tab as i, y}
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
                <td >
                    <a href="#/users/{i.username}">
                        <span class="user">
                            <img class="pp" src="http://localhost:3000/images/actual/{i.id}" alt="pp"/>
                            <p class="username">{i.username}</p>
                        </span>
                    </a>
                </td>
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

    .user{
        display: flex;
        display: flex;
        align-items:center;
    }

    .username {
        font-size: large;
        text-align: left;
        margin-left: 5px;
        margin-right: 2px;
    }
    .pp {
        width: 40px;
        height: 40px;
        border: 1px solid rgb(78, 78, 78);
        border-radius: 50%;
    }

</style>