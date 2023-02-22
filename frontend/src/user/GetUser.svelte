<script lang="ts">
    import axios from "axios";

    let username: string;

    function getUser() {
        axios.get(`http://localhost:3000/${username}`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)   
            })
        }
</script>

<form on:submit|preventDefault={getUser}>
    <input type="text" bind:value={username} placeholder="enter a username">
    <button type="submit">get user</button>
</form>

<style>
    form {
        text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
        }
</style>
