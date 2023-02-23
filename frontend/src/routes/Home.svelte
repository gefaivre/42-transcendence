<script>
    import SignUp from './user/SignUp.svelte';
    import GetUser from './user/GetUser.svelte'
</script>

<main>
    <p>Welcome to transcendance home page</p>
    <SignUp></SignUp>
    <GetUser></GetUser>
    <a href="#/chat">lien vers la chatroom</a>
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

