<script>

</script>

<main>
    <h1 class="zoom">Transcendence</h1>
    <br>
    <a href="#/usercrud">User CRUD</a>
    <br>
    <a href="#/leaderboard">Leaderboard</a>
    <br>
    <a href="#/signup">signup</a>
    <br>
    <a href="#/profile">profile (/!\ with JWT Guard /!\)</a>
</main>

<style>

    * {
		padding: 0em;
        margin: 0%;
    }

	main {
		text-align: center;
		margin: 0px;
        padding: 0px;
        color: #fff;
        background-color: black;
	}

    @keyframes pulsate {

    100% {

        text-shadow:
        0 0 4px #fff,
        0 0 11px #fff,
        0 0 19px #fff,
        0 0 40px #f09,
        0 0 80px #f09,
        0 0 90px #f09,
        0 0 100px #f09,
        0 0 150px #f09;

    }

    0% {

      text-shadow:
      0 0 4px #fff,
      0 0 10px #fff,
      0 0 18px #fff,
      0 0 38px #f09,
      0 0 73px #f09,
      0 0 80px #f09,
      0 0 94px #f09,
      0 0 140px #f09;

      }
    }

    .zoom {
        transition: transform .2s;
    }

    .zoom:hover {
        transform: scale(1.2);
    }

    h1 {
        animation: pulsate 1s ease-in-out infinite alternate;
    }

</style>

