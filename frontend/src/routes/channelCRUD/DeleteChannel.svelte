
<script lang="ts">

    import axios from "axios";

    let id: string = null

    function DeleteChannelbyId() {

        if (!id) {
            alert('Please provide an ID')
            return
        }

        axios.delete(`http://localhost:3000/channel/${id}`, {
            withCredentials: true
        })
        .then(res => { console.log(res.data) })
        .catch(err => { console.log(err) })
        id = null
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