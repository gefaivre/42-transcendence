<script lang="ts">

    import axios from "../../axios.config";

    function getAllUser() {
        axios.get(`/users/`)
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
