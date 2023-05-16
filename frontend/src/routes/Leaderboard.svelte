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
      } catch (e) {
        console.log(e)
      }
    };

    async function getGames() {
      try {
        tab = (await axios.get(`http://localhost:3000/leaderboard/games`, { withCredentials: true })).data
        console.log(tab)
      } catch (e) {
        console.log(e)
      }
    }

</script>

	<div class="screen">

		<table class="leaderboard">
				<thead>
					<tr>
								<th colspan="4">The big leaderboard</th>
						</tr>
						<tr>
								<th>Rank</th>
								<th>User</th>
								<th><a class="clickable" href="/#/leaderboard" on:click={() => getMmr()}>Mmr</a></th>
								<th><a class="clickable" href="/#/leaderboard" on:click={() => getGames()}>Games</a></th>
						</tr>
				</thead>
				<tbody>
						{#each tab as i, y}
						<tr>
								<td>{y + 1}</td>
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

	</div>

<style>

	.screen {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	td {
		text-align: center;
	}

	td, th {
    border: 1px solid rgb(190, 190, 190);
		padding: 10px;
	}

	tr:nth-child(even) {
    background-color: #eee;
	}

	.clickable {
			color: blue;
	}

	tbody tr:nth-child(1) > td:nth-child(1) {
			background-color: gold;
	}

	tbody tr:nth-child(2) td:nth-child(1) {
			background-color: silver;
	}

	tbody tr:nth-child(3) td:nth-child(1) {
			background-color: sienna;
	}

	.user{
			display: flex;
			display: flex;
			align-items:center;
	}

	.pp {
			width: 40px;
			height: 40px;
			border: 1px solid rgb(78, 78, 78);
			border-radius: 50%;
	}
	.username {
		padding-left: 10px;
	}

</style>