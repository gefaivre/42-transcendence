<script lang="ts">
    import axios from "axios";

    let username: string;

    function getAllUser() {
        axios.get(`http://localhost:3000/users/`)
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
