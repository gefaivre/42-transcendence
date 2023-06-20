<script lang="ts">
	import axios from "../axios.config";
	import { onMount } from "svelte";
  import { handleImageError } from "../utils";

	// TODO: get rid of unused `User` fields
	let users = [];

  const pageLength = 10
  let page = 1
  let totalPages: number
  let pagesArray: Array<number> = []

	onMount(() => getUsers());

	async function getUsers() {
		try {
			const response = await axios.get("/users");
      users = response.data;
      totalPages = users.length / pageLength + 1
      pagesArray = Array.from({length: totalPages}, (x, i) => i+1)
			sortByMMR();
		} catch (e) {
			console.log(e.response.data.messsage);
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

<br>
<br>

<table>
	<thead>
		<tr>
			<th>Rank</th>
			<th>User</th>
			<th><a class="clickable" href="/#/leaderboard" on:click={() => sortByMMR()}>Mmr</a></th>
			<th><a class="clickable" href="/#/leaderboard" on:click={() => sortByGames()}>Games</a></th>
		</tr>
	</thead>
	<tbody>
	{#each users as user, i}
    {#if i >= (page-1) * pageLength && i < page * pageLength}
		<tr>
			<td>{i + 1}</td>
			<td>
				<a href="#/users/{user.username}">
					<span class="user">
						<img class="pp" src="http://localhost:3000/images/actual/{user.id}" on:error={handleImageError} alt="pp"/>
						<p class="username">{user.username}</p>
					</span>
				</a>
			</td>
			<td>{user.mmr}</td>
			<td>{user.games}</td>
		</tr>
    {/if}
  {/each}
	</tbody>
</table>

<br>
<br>

<div class="join">
{#each pagesArray as _page}
  <button on:click={() => page = _page} class="join-item btn">{_page}</button>
{/each}
</div>

<style>

  table {
    margin: auto;
  }

  .join {
		text-align: center;
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
