<script lang="ts">

</script>

	<div class="info-container">

		<div class="box-info friends">
			<h1> Friends</h1>
		</div>
		<div class="box-info games">
			<h1>Game history</h1>
		</div>
		<div class="box-info statistics">
			<h1>Statistics</h1>
		</div>

	</div>


<style>

	.info-container {
		height: 100%;
		background-color: var(--grey);
		display: grid;
		grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr, 1fr;
		justify-items: center;
    align-items: center;
	}

	h1 {
		color: var(--white);
		text-align: center;
	}


	.box-info {
		margin: 50px;
		border: solid 2px var(--grey);
		box-shadow: 0 0 10px var(--lite-grey);
		background-color: var(--black);
		border-radius: 30px;
		height: 80%;
		width: 80%;
	}

	.friends{
		grid-column: 1 / 2;
		grid-row: 1 / 3;
	}

</style>