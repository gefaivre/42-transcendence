
<script lang="ts">

    import axios from "axios";
    import { getCookie } from "svelte-cookie"

    let jwt: string = getCookie('jwt')

    function DeleteAllChannel() {
        axios.delete(`http://localhost:3000/channel`, {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        .then(res => { console.log(res.data) })
        .catch(err => { console.log(err) })
    }

</script>

<form on:submit|preventDefault={DeleteAllChannel}>
    <fieldset>
        <legend>DeleteAllChannel</legend>
        <button class="warning" type="submit">Delete</button>
    </fieldset>
</form>

<style>
    legend {
        background-color: #ff0000;
        color: #ffffff;
        padding: 3px 6px;
    }
    fieldset {
        border-color: red;
        text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
    }
</style>