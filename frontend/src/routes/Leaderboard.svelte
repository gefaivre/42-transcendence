<script lang="ts">
	import axios from "../axios.config";
	import { onMount } from "svelte";
	import { logged } from "../stores";

	// TODO: get rid of unused `User` fields
	let users = [];

	onMount(() => getUsers());

	async function getUsers() {
		try {
			users = (await axios.get("/users")).data;
			console.log(users);
			sortByMMR();
		} catch (error) {
			console.log(error.response.data.messsage);
		}
	}

	function sortByMMR() {
		users.sort((a, b) => b.mmr - a.mmr);
		users = users; // svelte reload
	}

	function sortByGames() {
		users.sort((a, b) => b.games - a.games);
		users = users; // svelte relaod
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
				<th>
          <a
						class="clickable" href="/#/leaderboard"
						on:click={() => sortByMMR()}>Mmr</a
					>
        </th>
				<th>
					<a
						class="clickable" href="/#/leaderboard"
						on:click={() => sortByGames()}>Games</a
					>
        </th>
			</tr>
		</thead>
		<tbody>
			{#each users as user, i}
				<tr>
					<td>{i + 1}</td>
					<td>
						<a href="#/users/{user.username}">
							<span class="user">
								<img
									class="pp"
									src="http://localhost:3000/images/actual/{user.id}"
									alt="pp"
								/>
								<p class="username">{user.username}</p>
							</span>
						</a>
					</td>
					<td>{user.mmr}</td>
					<td>{user.games}</td>
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

	td,
	th {
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

	.user {
		display: flex;
		display: flex;
		align-items: center;
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
