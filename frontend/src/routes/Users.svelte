<script>

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import { getCookie } from "svelte-cookie"

    let jwt = getCookie('jwt')
    let tab = {};
    export let params = {}

    onMount(async () => {
        axios.get(`http://localhost:3000/users/${params.name}`, {
            headers : { Authorization: 'Bearer ' + jwt }
        })
        .then(res => {
            console.log(res.data)
            tab = res.data;
        })
        .catch(err => {
            console.log(err)
        })
    });

</script>

{#if $logged}
    <h1>{tab.username}</h1>
    <table>
        <tbody>
            <tr>
                <td>Username:</td> <td>{tab.username}</td>
            </tr>
            <tr>
                <td>Password:</td> <td>{tab.password}</td>
            </tr>
            <tr>
                <td>Games played:</td> <td>{tab.games}</td>
            </tr>
            <tr>
                <td>Mmr:</td> <td>{tab.mmr}</td>
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