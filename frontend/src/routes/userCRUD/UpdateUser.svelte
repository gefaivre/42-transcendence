<script lang="ts">

    import axios from 'axios'
    import { getCookie } from "svelte-cookie"

    type User = {
        username: string;
        password: string;
        mmr: number;
        games: number;
    }

    let user: User = {
        username: '',
        password: '',
        mmr: 0,
        games: 0
    }

    let username: string
    let jwt: string = getCookie('jwt')

    function UpdateUser() {
        Object.keys(user).forEach((k) => user[k] == null && delete user[k]);
        axios.patch(`http://localhost:3000/users/${username}`, user, {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        .then((res) => { console.log(res.data) })
        .catch((err) => { console.log(err) });
    };

</script>

<form on:submit|preventDefault={UpdateUser}>

    <fieldset>
        <legend>UpdateUser</legend>
        <input type="text" bind:value={username} placeholder="enter a username"><br>
        <input type="text" bind:value={user.username} placeholder="update username"><br>
        <input type="text" bind:value={user.password} placeholder="update password"><br>
        <input type='number' bind:value={user.mmr} placeholder="update mmr"><br>
        <input type='number' bind:value={user.games} placeholder="update games"><br>
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
