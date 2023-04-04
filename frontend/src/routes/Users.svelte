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

    export let params: any = { }

    onMount(async () => await getUser())

    async function getUser() {
        const response = await
        axios.get(`http://localhost:3000/users/${params.name}`, { withCredentials: true })
        user = response.data
        console.log(params)
    }

    async function changeUsername() {

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

        // update component state
        user.username = username
        username = null

        // redirect to your new user page
        replace(`/users/${user.username}`)

      } catch (error) {
        if (error.response.status == 409)
          alert('This username is already used.')
        if (error.response.status == 401)
          alert('Unauthorized to change other player username.')
      }

    }

    let fileInput
    const handleSubmit = async () => {
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });

      console.log(response.data); // do something with the response from the backend
    } catch (error) {
      console.error(error);
    }
  };

</script>

{#if $logged === 'true'}
    <img src="http://localhost:3000/images/{user.id}" alt="profil">
    <form on:submit|preventDefault={handleSubmit}>
      <input type="file" bind:this={fileInput} accept="image/*">
      <button type="submit">Upload</button>
    </form>

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
      <button on:click={changeUsername}>Change</button>
    {/if}

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}

<style>
img {
    max-width:250px;
}
</style>
