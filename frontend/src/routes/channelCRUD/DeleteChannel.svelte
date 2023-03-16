
<script lang="ts">

    import axios from "axios";
    import { getCookie } from "svelte-cookie"

    let id: string = ''
    let jwt: string = getCookie('jwt')

    function DeleteChannelbyId() {
        axios.delete(`http://localhost:3000/channel/${id}`, {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        .then(res => { console.log(res.data) })
        .catch(err => { console.log(err) })
    }

</script>

<form on:submit|preventDefault={DeleteChannelbyId}>
    <fieldset>
        <legend>DeleteChannel</legend>
        <input type="text" bind:value={id} placeholder="channel id">
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