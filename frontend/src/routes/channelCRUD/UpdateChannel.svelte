
<script lang="ts">

    import axios from 'axios'

    type Channel = {
        id: number
        name: string
        ownerId: number
    }

    let channel: Channel = {
        id: null,
        name: null,
        ownerId: null,
    }

    function UpdateChannel() {
        alert('not implemented yet')
    };

</script>

<form on:submit|preventDefault={UpdateChannel}>

    <fieldset>
        <legend>UpdateChannel</legend>
        <input type="text" bind:value={channel.id} placeholder="channel id"><br>
        <input type="text" bind:value={channel.name} placeholder="update name"><br>
        <input type="text" bind:value={channel.ownerId} placeholder="update owner id"><br>
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
