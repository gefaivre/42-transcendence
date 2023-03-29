<script lang="ts">

    import axios from "axios";
    import { onMount } from "svelte";
    import { logged, id } from "../stores";
    import { replace } from "svelte-spa-router";
    import type { User } from "../types";

    let user: User = {
        id: 0,
        username: null,
        password: null,
        mmr: null,
        games: null,
        ft_login: null
    }

    let username: string = null
    let password: string = null

    export let params: any = { }

    onMount(async () => await getUser())

    async function getUser() {
        user = (await axios.get(`http://localhost:3000/users/${params.name}`, { withCredentials: true })).data
    }

    async function updateUsername() {

      // guards
      if (username == null) { return alert('empty username') }
      if (username == user.username) { return alert('same username') }

      try {

        // Yes, this body is dirty.
        await axios.patch(`http://localhost:3000/users/username/${user.username}`, {
          id: $id,
          username: username
        }, {
          withCredentials: true
        })

        alert('Username successfully updated!')

        // update component state
        user.username = username
        username = null

        // redirect to your new user page
        replace(`/users/${user.username}`)

      } catch (error) {
        alert(error.response.data.message)
      }

    }

    // before update, password displayed in table is the hash
    // after update, password displayed in table is in clear
    // you'll need to refresh the page to see the new password in its hashed version
    // this is not big deal since this table entry will be removed anyway
    async function updatePassword() {

      // guards
      if (password == null) { return alert('empty password') }

      try {

        // Yes, this body is dirty.
        await axios.patch(`http://localhost:3000/users/password/${user.username}`, {
          id: $id,
          password: password
        }, {
          withCredentials: true
        })

        alert('Password successfully updated!')

        // update component state
        user.password = password
        password = null

        // redirect to your new user page
        replace(`/users/${user.username}`)

      } catch (error) {
        alert(error.response.data.message)
      }

    }

</script>

{#if $logged === 'true'}
    <h1>{user.username}</h1>
    <table>
        <tbody>
            <tr>
                <td>id</td> <td>{user.id}</td>
            </tr>
            <tr>
                <td>Username</td> <td>{user.username}</td>
            </tr>
            <tr>
                <td>Password</td> <td>{user.password}</td>
            </tr>
            <tr>
                <td>Games played</td> <td>{user.games}</td>
            </tr>
            <tr>
                <td>Mmr</td> <td>{user.mmr}</td>
            </tr>
            <tr>
                <td>42 login</td> <td>{user.ft_login}</td>
            </tr>
        </tbody>
    </table>

    <br>
    <br>

    {#if $id === user.id.toString()}
      <input type="text" placeholder="new username" bind:value={username}>
      <button on:click={updateUsername}>Update</button>
      <br>
      <input type="text" placeholder="new password" bind:value={password}>
      <button on:click={updatePassword}>Update</button>
    {/if}

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}
