<script lang="ts">
	export let name: string;
	import pingBackend from './ping.js';
    import SignUp from './user/SignUp.svelte';
    import GetUser from './user/GetUser.svelte'
    import Chat from './chat/Chat.svelte'
</script>

<main>
	<h1>salut {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	<button on:click={pingBackend}>connexion au back</button>
    <SignUp></SignUp>
    <GetUser></GetUser>
    <Chat></Chat>
</main>


<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>

