<script lang="ts">

    import axios from 'axios'

    type Channel = {
        name: string
        ownerId: number
    }

    let channel: Channel = {
        name: null,
        ownerId: 1, // TODO
    }

    async function addChannel() {
        console.log(channel)
        const response = await axios.post('http://localhost:3000/channel', channel, {
            withCredentials: true
        })
        console.log(response)
    }

</script>


<form on:submit|preventDefault={addChannel}>
    <fieldset>
        <legend>addChannel</legend>
        <input type="text" bind:value={channel.name} placeholder="channel name">
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
