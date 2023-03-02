<script>
    import SignUp from './user/SignUp.svelte';
    import GetUser from './user/GetUser.svelte'
</script>

<main>
    <p>Welcome to transcendance home page</p>
    <SignUp></SignUp>
    <GetUser></GetUser>
    <a href="#/test">lien vers la page de test</a>
    <br>
    <a href='https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-8085f461d94ae4952524892336b6a6f256497a5f11dfb2769987ac3ccb99c13d&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2F42&response_type=code'>auth</a>
</main>

<style>
        main {
                text-align: center;
                padding: 1em;
                max-width: 240px;
                margin: 0 auto;
        }

        @media (min-width: 640px) {
                main {
                        max-width: none;
                }
        }
</style>

