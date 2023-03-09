<script lang="ts">

    import axios from "axios";
    import { getCookie } from "svelte-cookie"

    let username: string;
    let jwt: string = getCookie('jwt')

    function getUser() {
        axios.get(`http://localhost:3000/users/${username}`, {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        .then(res => { console.log(res.data) })
        .catch(err => { console.log(err) })
    }

</script>

<form on:submit|preventDefault={getUser}>
    <fieldset>
        <legend>GetUser</legend>
        <input type="text" bind:value={username} placeholder="enter a username">
        <br>
        <button type="submit">submit</button>
    </fieldset>
</form>

<style>
    legend {
        background-color: #000;
        color: #fff;
        padding: 3px 6px;
    }
    fieldset {
        text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
    }
</style>
