<script lang="ts">

    import axios from "axios";

    let username: string;

    function getUser() {
        axios.get(`http://localhost:3000/users/${username}`, {
            withCredentials: true
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
