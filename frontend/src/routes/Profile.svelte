<script lang="ts">

    import { getCookie } from 'svelte-cookie';
    import { onMount } from "svelte";
    import axios from "axios";

    let profile: string = ''
    let logged: boolean = false
    let jwt: string = getCookie('jwt')

    onMount(() => {

        axios.get('http://localhost:3000/profile', {
            headers : {
                Authorization: 'Bearer ' + jwt
            }
        })
        .then((res) => {
            logged = true
            profile = JSON.stringify(res.data)
        })
        .catch((err) => { console.log(err) })

    })

</script>

<main>

    {#if logged}
        You successfully authenticated as {profile}
        <br>
        Your jwt is {jwt}
    {:else}
        You not already authenticated...
    {/if}

</main>

<style></style>