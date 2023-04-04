<script lang="ts">

    import axios from "axios";

    function getAllUser() {
        axios.get(`http://localhost:3000/users/`, {
            withCredentials: true
        })
        .then(res => { console.log(res.data) })
        .catch(err => { console.log(err) })
    }

</script>

<form on:submit|preventDefault={getAllUser}>
    <fieldset>
        <legend>GetAllUser</legend>
        <button type="submit">submit</button>
    </fieldset>
</form>
