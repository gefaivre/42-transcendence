<script lang="ts">

    import axios from '../../axios.config'

    let user = {
        username: '',
        password: '',
    }

    function signUp() {
        axios.post('/users', user)
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
