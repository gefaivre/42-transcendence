<script lang="ts">

</script>

	<div class="infoContainer">

		<div class="boxInfo friends">
			<h1> Friends</h1>
		</div>
		<div class="boxInfo gamesHistory">
			<h1>Game history</h1>
		</div>
		<div class="boxInfo statistics">
			<h1>Statistics</h1>
		</div>

	</div>


<style>

	h1 {
		color: var(--white);
	}

	.infoContainer {
		display: grid;
		height: 100%;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 1fr;
		background-color: var(--grey);
	}

	.boxInfo {
		margin: 50px;
		border: solid 2px var(--grey);
		box-shadow: 0 0 10px var(--lite-grey);
		background-color: var(--black);
		border-radius: 10%;
	}

</style>