
<script lang="ts">

    import axios from "axios";
    import type { Channel } from "../../types";

    let channels: Channel[] = []

    async function getAllChannel() {
        const response = await axios.get('http://localhost:3000/channel', {
            withCredentials: true
        })
        channels = response.data
        console.log(response)
        console.log(channels)
    }

</script>

<form on:submit|preventDefault={getAllChannel}>
    <fieldset>
        <legend>GetAllChannel</legend>
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
