<script lang="ts">

    import axios from 'axios';
    import { logged } from "../stores";
    import { onMount } from "svelte";
    import type { Channel } from "../types";

    const columns: string[] = ['id', 'name', 'owner', 'owner id', 'users', 'admins']
    let channels: Channel[] = []

    onMount(() => getAll())

    async function getAll() {

        const response = await
        axios.get('http://localhost:3000/channel', { withCredentials: true })

        channels = response.data
        console.log(channels)
    }

    async function remove(id: number) {

        if (!window.confirm("Are you sure ?")) return

        const response = await
        axios.delete(`http://localhost:3000/channel/${channel.id}`, { withCredentials: true })

        console.log(response)
        getAll()
    }

    async function removeAll() {

        if (!window.confirm("Are you sure ?")) return

        const response = await
        axios.delete(`http://localhost:3000/channel`,{ withCredentials: true })

        getAll()
    }

    async function create() {

        // This object mirror the backend `CreateChannelDto` class
        let channel = { name: null, ownerId: 1 } // TODO: custom ownerId

        channel.name = prompt("Enter channel name")

        if (!channel.name) {
            alert('Please provide a channel name')
            return
        }

        const response = await
        axios.post('http://localhost:3000/channel', channel, { withCredentials: true })

        console.log(response)
        getAll()
    }

</script>

<main>

{#if $logged}

    <br>
    <br>

    <table>
        <thead>
            <tr>
                <th colspan="6">Channels</th>
            </tr>
            <tr>
                {#each columns as column}
                    <td>{column}</td>
                {/each}
            </tr>
        </thead>
        <tbody>
            {#each channels as c}
            <tr>
                <td contenteditable="false" bind:innerHTML={c.id} />
                <td contenteditable="false" bind:innerHTML={c.name} />
                <td>
                <a contenteditable="false" bind:innerHTML={c.owner.username} href="#/users/{c.owner.username}"/>
                </td>
                <td contenteditable="false" bind:innerHTML={c.users.length} />
                <td contenteditable="false" bind:innerHTML={c.users.length} />
                <td contenteditable="false" bind:innerHTML={c.admins.length} />
                <button on:click={() => remove(c.id)}>Delete</button>
            </tr>
            {/each}
        </tbody>
    </table>

    <br>
    <br>

    <button on:click={create}>New</button>
    <button on:click={removeAll}>Delete all</button>

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

</main>

<style>

    main {
    	text-align: center;
    }

    table, td {
        margin: auto;
        min-width: 70px;
        text-align: center;
        border: 1px solid #333;
    }

    thead {
        background-color: #333;
        color: #fff;
    }

</style>