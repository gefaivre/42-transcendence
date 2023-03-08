<script>
    import axios from "axios";
    import { onMount } from "svelte";



    let tab = [];

    onMount(async () => {
        axios.get(`http://localhost:3000/leaderboard/mmr`)
            .then(res => {
                console.log(res.data)
                tab = res.data;
            })
            .catch(err => {
                console.log(err)
            })
        });

    function getMmr() {
        axios.get(`http://localhost:3000/leaderboard/mmr`)
        .then(res => {
            console.log(res.data)
            tab = res.data;
            })
            .catch(err => {
                console.log(err)
            })
        };

    function getGames() {
        axios.get(`http://localhost:3000/leaderboard/games`)
            .then(res => {
                console.log(res.data)
                tab = res.data;
            })
            .catch(err => {
                console.log(err)
            })
        };

</script>

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
            <td class="username" ><a href="#/users/{i.username}">{i.username}</a></td>
            <td>{i.mmr}</td>
            <td>{i.games}</td>
        </tr>
        {/each}
    </tbody>
</table>

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
    h1 {
        text-align: center;
    }

    .leaderboard {
        margin: auto;
    }
    .username {
        text-align:left;
    }

    table,
    td {
        border: 1px solid #333;
        min-width: 70px;
        text-align: center;
    }

    thead {
        background-color: #333;
        color: #fff;
    }
</style>