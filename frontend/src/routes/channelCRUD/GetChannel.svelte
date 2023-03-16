<script lang="ts">

    import axios from "axios";

    let id: string;

    function getChannelById() {
        axios.get(`http://localhost:3000/channel/${id}`, {
            withCredentials: true
        })
        .then(res => { console.log(res.data) })
        .catch(err => { console.log(err) })
    }

</script>

<form on:submit|preventDefault={getChannelById}>
    <fieldset>
        <legend>GetChannel</legend>
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
