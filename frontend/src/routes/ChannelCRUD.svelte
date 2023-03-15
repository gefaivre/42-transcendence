<script lang="ts">

    import axios from 'axios';
    import { logged } from "../stores";
    import { onMount } from "svelte";
    import { getCookie } from 'svelte-cookie';
    import GetChannel from "./channelCRUD/GetChannel.svelte";
    import AddChannel from "./channelCRUD/AddChannel.svelte";
    import GetAllChannel from "./channelCRUD/GetAllChannel.svelte";
    import DeleteChannel from "./channelCRUD/DeleteChannel.svelte";
    import DeleteAllChannel from './channelCRUD/DeleteAllChannel.svelte';
    import UpdateChannel from './channelCRUD/UpdateChannel.svelte';

    type Channel = {
        id: number
        name: string
        ownerId: number
    }

    let jwt = getCookie('jwt');
    let channels: Channel[] = []

    onMount(() => getAllChannel())

    async function getAllChannel() {
        const response = await axios.get('http://localhost:3000/channel', {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        channels = response.data
        console.log(response)
        console.log(channels)
    }

</script>

<main>

{#if $logged}

    <h1>--ChannelCRUD--</h1>

    <AddChannel></AddChannel>
    <GetChannel></GetChannel>
    <UpdateChannel></UpdateChannel>
    <GetAllChannel></GetAllChannel>
    <DeleteChannel></DeleteChannel>
    <DeleteAllChannel></DeleteAllChannel>

    <br>
    <br>

    <!--
        TODO
        - add `owner` column
        - add `number of participants` column
    -->

    <table class="channels">
        <thead>
            <tr>
                <th colspan="4">Channels</th>
            </tr>
            <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Owner ID</td>
            </tr>
        </thead>
        <tbody>
            {#each channels as channel}
            <tr>
                <td>{channel.id}</td>
                <td>{channel.name}</td>
                <td>{channel.ownerId}</td>
            </tr>
            {/each}
        </tbody>
    </table>

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

</main>

<style>
    h1 {
        text-align: center;
    }

    main {
    	text-align: center;
    	margin: 0px;
        padding: 0px;
    }

    .channels {
        margin: auto;
    }

    table, td {
        border: 1px solid #333;
        min-width: 70px;
        text-align: center;
    }

    thead {
        background-color: #333;
        color: #fff;
    }
</style>
