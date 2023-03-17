<script lang="ts">

    import axios from "axios";
    import type { Channel } from "../../types";

    let id: string = null
    let channel: Channel = null

    async function getChannelById() {

        if (!id) {
            alert('Please provide a channel ID')
            return
        }

        const response = await axios.get(`http://localhost:3000/channel/${id}`, {
            withCredentials: true
        })
        channel = response.data
        console.log(channel)
        id = null
        channel = null
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
