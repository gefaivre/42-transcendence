<script lang="ts">

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import { getCookie } from "svelte-cookie"
    import type { User } from "../types";

    let user: User = {
        username: '',
        password: '',
        mmr: 0,
        games: 0
    }

    let jwt: string = getCookie('jwt')
    export let params: any = {}

    onMount(async () => {
        axios.get(`http://localhost:3000/users/${params.name}`, {
            headers : { 'Authorization': 'Bearer ' + jwt }
        })
        .then(res => {
            console.log(res.data)
            user = res.data;
        })
        .catch(err => {
            console.log(err)
        })
    });

</script>

{#if $logged}
    <h1>{user.username}</h1>
    <table>
        <tbody>
            <tr>
                <td>Username:</td> <td>{user.username}</td>
            </tr>
            <tr>
                <td>Password:</td> <td>{user.password}</td>
            </tr>
            <tr>
                <td>Games played:</td> <td>{user.games}</td>
            </tr>
            <tr>
                <td>Mmr:</td> <td>{user.mmr}</td>
            </tr>
        </tbody>
    </table>

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

<style>
    table, td {
        border: 1px solid #333;
    }
</style>
