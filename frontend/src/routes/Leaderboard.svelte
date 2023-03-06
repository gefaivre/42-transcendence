<script>
    import axios from "axios";
    import { onMount } from "svelte";



    let tab = [];

    onMount(async () => {
        axios.get(`http://localhost:3000/users/leaderboard`)
            .then(res => {
                console.log(res.data)
                tab = res.data;
            })
            .catch(err => {
                console.log(err)   
            })
        });

</script>

<h1>--LeaderBord--</h1>


<table class="leaderboard">
    <thead>
        <tr>
            <th colspan="3">The big leaderboard</th>
        </tr>
        <tr>
            <td>Username</td>
            <td>Mmr</td>
            <td>Games</td>
        </tr>
    </thead>
    <tbody>

        {#each tab as i}
        
        <tr>
            <td class="username" >{i.username}</td>
            <td>{i.mmr}</td>
            <td>{i.games}</td>
        </tr>
        {/each}
    </tbody>
</table>

<style>
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