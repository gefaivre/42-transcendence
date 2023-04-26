<script lang="ts">
    import axios from "axios";
		import { logged, id, reloadImage, user } from "../../stores";




	async function getUser() {

	}

async function requestFriendship() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/request/${$user.id}`, null, { withCredentials: true })
        getUser()
      } catch (error) {
        console.log(error)
      }
    }

    async function acceptFriendshipRequestById() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/acceptById/${$user.id}`, null, { withCredentials: true })
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
        await axios.post(`http://localhost:3000/users/friendship/dismissById/${$user.id}`, null, { withCredentials: true })
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
        const cancel = await axios.post(`http://localhost:3000/users/friendship/cancelById/${$user.id}`, null, { withCredentials: true })
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
        const cancel = await axios.post(`http://localhost:3000/users/friendship/removeById/${$user.id}`, null, { withCredentials: true })
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

	<div class="info-container">

		<div class="box-info friends">
			<h1> Friends</h1>
		</div>
		<div class="box-info games">
			<h1>Game history</h1>
		</div>
		<div class="box-info statistics">
			<h1>Statistics</h1>
		</div>

	</div>

	    <!-- <h1>{user.username}</h1>
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
    {:else if user.friends.some(user => user.id.toString() === $id)}
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

{:else}
    <h1>UNAUTHORIZED ACCESS</h1>
{/if} -->


<style>

	.info-container {
		height: 100%;
		background-color: var(--grey);
		display: grid;
		grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr, 1fr;
		justify-items: center;
    align-items: center;
	}

	h1 {
		color: var(--white);
		text-align: center;
	}


	.box-info {
		margin: 50px;
		border: solid 2px var(--grey);
		box-shadow: 0 0 10px var(--lite-grey);
		background-color: var(--black);
		border-radius: 30px;
		height: 80%;
		width: 80%;
	}

	.friends{
		grid-column: 1 / 2;
		grid-row: 1 / 3;
	}

</style>