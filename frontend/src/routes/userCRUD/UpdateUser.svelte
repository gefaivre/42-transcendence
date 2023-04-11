<script lang="ts">

    import axios from 'axios'
    import type { User } from '../../types'

    let user: User = {
        username: '',
        password: '',
        mmr: 0,
        games: 0,
        ft_login: '',
        id : 0
    }

    let username: string

    function UpdateUser() {
        Object.keys(user).forEach((k) => user[k] == null && delete user[k]);
        axios.patch(`http://localhost:3000/users/${username}`, user, {
            withCredentials: true
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
