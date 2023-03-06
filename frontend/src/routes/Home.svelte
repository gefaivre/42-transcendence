<script>
<<<<<<< HEAD
    import SignUp from './user/SignUp.svelte';
    import GetUser from './user/GetUser.svelte';

    let link = FT_AUTHORIZE
</script>

<main>
    <p>Welcome to transcendance home page</p>
    <SignUp></SignUp>
    <GetUser></GetUser>
    <a href="#/test">lien vers la page de test</a>
    <br>
    <a href={link}>signin with 42</a>
=======

</script>

<main>
    <h1>Welcome to transcendance home page</h1>
    <a href="#/test">test</a>
    <br>
    <a href="#/usercrud">User CRUD</a>
    <br>
    <a href="#/leaderboard">Leaderboard</a>
>>>>>>> ecce671e252aef6813f4f39cbdbcaec737287ff9
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>

