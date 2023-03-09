<script lang="ts">

    import axios from 'axios'
    import { getCookie } from "svelte-cookie"

    type User = {
        username: string;
        password: string;
    }

    let user : User = {
        username: '',
        password: ''
    }

    let jwt: string = getCookie('jwt')

    function signUp() {
        axios.post('http://localhost:3000/users', user, {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        .then((res) => { console.log(res.data) })
        .catch((err) => { console.log(err) });
    };

</script>

<form on:submit|preventDefault={signUp}>
    <fieldset>
        <legend>AddUser</legend>
        <input type="text" bind:value={user.username} placeholder="enter a username"><br>
        <input type='password' bind:value={user.password} placeholder="enter password"><br>
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
