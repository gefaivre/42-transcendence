<script lang="ts">

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged } from "../stores";
    import type { User } from "../types";

    let user: User = {
        username: '',
        password: '',
        mmr: 0,
        games: 0,
        ft_login: ''
    }

    let username: string = null

    export let params: any = { }

    onMount(() => getUser())

    async function getUser() {
        const response = await
        axios.get(`http://localhost:3000/users/${params.name}`, { withCredentials: true })
        user = response.data
    }

    async function changeUsername() {

      // guards
      if (username == null) { return alert('empty username') }
      if (username == user.username) { return alert('same username') }

      try {

        // proper dto (cf. /backend/src/users/dto/update-user.dto)
        const updateUsernameDto = { username: username }

        // patch username request
        const response = await
        axios.patch(`http://localhost:3000/users/username/${user.username}`, updateUsernameDto, { withCredentials: true })

        // update component state
        username = null
        user.username = updateUsernameDto.username

        // TODO: modify param to refresh with brand new route
        // Or get user based on id (which doesnt't change) instead of username
        params.username = user.username

        // log
        console.log(response.data)
      } catch (error) {
        console.log(error.data)
      }

    }

</script>

{#if $logged === 'true'}
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
            <tr>
                <td>42 login:</td> <td>{user.ft_login}</td>
            </tr>
        </tbody>
    </table>

    <br>
    <br>

    <input type="text" placeholder="new username" bind:value={username}>
    <button on:click={changeUsername}>Change</button>

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}
