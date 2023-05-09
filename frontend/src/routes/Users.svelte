<script lang="ts">

  import axios from "axios";
  import { onMount } from "svelte";
  import { logged, id } from "../stores";
  import { replace } from "svelte-spa-router";
  import type { User } from "../types";
  import ChangePp from "./userImages/ChangePp.svelte";

    type Friends = {
      friends: { id: number, username: string }[]
      friendOf: { id: number, username: string }[]
      pendingFriends: { id: number, username: string }[]
      requestFriends: { id: number, username: string }[]
    }

    let user: User & Friends = {
        id: 0,
        username: null,
        password: null,
        mmr: null,
        games: null,
        ft_login: null,
        TwoFA: false,
        friends: [],
        friendOf: [],
        pendingFriends: [],
        requestFriends: [],
    }

    let username: string = null
    let password: string = null

    let reloadImage: number = 0

    let qrcode = ''
    let code2FA = ''

    export let params: any = { }

    onMount(async () => { await getUser(); console.log(user) })

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

    async function validate2FA() {
        try {
            await axios.post('http://localhost:3000/auth/2FA/validate', { token: code2FA }, { withCredentials: true })
            qrcode = ''
            code2FA = ''
            getUser()
        } catch (error) {
            console.log(error.response.message)
        }
    }

    async function enable2FA() {
        try {
            const response = await axios.patch(`http://localhost:3000/auth/2FA/enable`, null, { withCredentials: true })
            qrcode = response.data
        } catch (error) {
            console.log(error.response.message)
        }
    }

    async function disable2FA() {
        try {
            await axios.patch(`http://localhost:3000/auth/2FA/disable`, null, { withCredentials: true })
            getUser()
        } catch (error) {
            console.log(error.response.message)
        }
    }

    async function requestFriendship() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/request/${user.id}`, null, { withCredentials: true })
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function acceptFriendshipRequestById() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/acceptById/${user.id}`, null, { withCredentials: true })
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function acceptFriendshipRequestByName(name: string) {
      try {
        await axios.post(`http://localhost:3000/users/friendship/acceptByName/${name}`, null, { withCredentials: true })
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function dismissFriendshipRequestById() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/dismissById/${user.id}`, null, { withCredentials: true })
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function dismissFriendshipRequestByName(name: string) {
      try {
        await axios.post(`http://localhost:3000/users/friendship/dismissByName/${name}`, null, { withCredentials: true })
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function cancelFriendshipRequestById() {
      try {
        const cancel = await axios.post(`http://localhost:3000/users/friendship/cancelById/${user.id}`, null, { withCredentials: true })
        console.log(cancel)
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function cancelFriendshipRequestByName(name: string) {
      try {
        const cancel = await axios.post(`http://localhost:3000/users/friendship/cancelByName/${name}`, null, { withCredentials: true })
        console.log(cancel)
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function removeFriendById() {
      try {
        const cancel = await axios.post(`http://localhost:3000/users/friendship/removeById/${user.id}`, null, { withCredentials: true })
        console.log(cancel)
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function removeFriendByName(name: string) {
      try {
        const cancel = await axios.post(`http://localhost:3000/users/friendship/removeByName/${name}`, null, { withCredentials: true })
        console.log(cancel)
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

</script>

{#if $logged === 'true'}
    <img class="imagePP" src="http://localhost:3000/images/actual/{user.id}?$reload=${reloadImage}" alt="profil">
    {#if $id === user.id.toString() }
      <ChangePp bind:reloadImage={reloadImage} />
    {/if}

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
            <tr>
                <td>2FA</td><td>{user.TwoFA}</td>
            </tr>
            <tr>
                <td>Friends</td>
                <td>
                  {#each user.friends as friend}
                    {friend.username}
                    {#if $id === user.id.toString()}
                      <button on:click={() => removeFriendByName(friend.username)}>remove</button>
                    {/if}
                  {/each}
                </td>
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
      <br>
      <br>
      {#if user.TwoFA === false}
        <button on:click={enable2FA}>Enable TWOFA</button>
      {:else}
        <button on:click={disable2FA}>Disable TWOFA</button>
      {/if}
      {#if qrcode !== ''}
        <br>
        <br>
        <img alt='qrcode' src={qrcode}>
        <br>
        <br>
        <input type="text" placeholder="code" bind:value={code2FA}>
        <button on:click={validate2FA}>Validate</button>
      {/if}
      <br>
      <br>
      <ul>
      {#each user.requestFriends as requestFriends}
        <li>
          <b>{requestFriends?.username}</b> requested you as friend
          <button on:click={() => acceptFriendshipRequestByName(requestFriends.username)}>Accept</button>
          <button on:click={() => dismissFriendshipRequestByName(requestFriends.username)}>Dismiss</button>
        </li>
      {/each}
      </ul>
      <br>
      <ul>
      {#each user.pendingFriends as pendingFriends}
        <li>
          You requested <b>{pendingFriends?.username}</b> as friend
          <button on:click={() => cancelFriendshipRequestByName(pendingFriends.username)}>Cancel</button>
        </li>
      {/each}
      </ul>
    <br>
    <br>
    {:else}
      {#if user.friends.some(user => user.id.toString() === $id)}
        This user is your friend !
        <button on:click={removeFriendById}>Remove</button>
      {:else if user.requestFriends.some(user => user.id.toString() === $id)}
        Pending friend invitation...
        <button on:click={cancelFriendshipRequestById}>Cancel</button>
      {:else if user.pendingFriends.some(user => user.id.toString() === $id)}
        This user requested you as friend
        <button on:click={acceptFriendshipRequestById}>Accept</button>
        <button on:click={dismissFriendshipRequestById}>Dismiss</button>
      {:else}
        <button on:click={requestFriendship}>Request friendship</button>
      {/if}
        <button on:click={() => replace(`/dm/${user.username}`)}>DM</button>
    {/if}

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if}


<style>

.imagePP {
  border: 5px solid rgb(78, 78, 78);
  border-radius: 50%;
  height: 200px;
  width: 200px;
}

</style>
