<script lang="ts">

    import axios from "axios";

    let username: string;

    function DeleteUser() {
        axios.delete(`http://localhost:3000/users/${username}`, {
            withCredentials: true
        })
        .then(res => { console.log(res.data) })
        .catch(err => { console.log(err) })
    }

</script>

<form on:submit|preventDefault={DeleteUser}>
    <fieldset>
        <legend>DeleteUser</legend>
        <input type="text" bind:value={username} placeholder="enter a username">
        <br>
        <button type="submit">submit</button>
    </fieldset>
</form>
