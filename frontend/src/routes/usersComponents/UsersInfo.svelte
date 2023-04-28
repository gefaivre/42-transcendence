<script lang="ts">
    import axios from "axios";
		import { logged, id, reloadImage, user } from "../../stores";
    import deleteIcon        from '../../assets/redLose.png';


    export let pageUser;


	async function getUser() {

	}

    async function requestFriendship() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/request/${pageUser.id}`, null, { withCredentials: true })
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

      <ul>

        {#each pageUser.friends as friend}
        <li class="lineFriend">
          <a class="name" href="#/users/{friend.username}">{friend.username}</a>
          {#if $id === pageUser.id.toString()}
          <button class="deleteFriendBtn" on:click={() => removeFriendByName(friend.username)}>
            <img class="btnImage" src={deleteIcon} alt="deleteicon">
          </button>
          {/if}
        </li>
        {/each}

      </ul>
    <br>
    <br>

    {#if $id === pageUser.id.toString()}
      <ul>
      {#each pageUser.requestFriends as requestFriends}
        <li>
          <b>{requestFriends?.username}</b> requested you as friend
          <button on:click={() => acceptFriendshipRequestByName(requestFriends.username)}>Accept</button>
          <button on:click={() => dismissFriendshipRequestByName(requestFriends.username)}>Dismiss</button>
        </li>
      {/each}
      </ul>
      <br>
      <ul>
      {#each pageUser.pendingFriends as pendingFriends}
        <li>
          You requested <b>{pendingFriends?.username}</b> as friend
          <button  on:click={() => cancelFriendshipRequestByName(pendingFriends.username)}>Cancel</button>
        </li>
      {/each}
      </ul>
    {:else if pageUser.friends.some(user => user.id.toString() === $id)}
      This user is your friend !
      <button on:click={removeFriendById}>Remove</button>
    {:else if pageUser.requestFriends.some(user => user.id.toString() === $id)}
      Pending friend invitation...
      <button on:click={cancelFriendshipRequestById}>Cancel</button>
    {:else if pageUser.pendingFriends.some(user => user.id.toString() === $id)}
      This user requested you as friend
      <button on:click={acceptFriendshipRequestById}>Accept</button>
      <button on:click={dismissFriendshipRequestById}>Dismiss</button>
    {:else}
      <button on:click={requestFriendship}>Request friendship</button>
    {/if}

	</div>

    <div class="box-info games">
      <h1>Game history</h1>
    </div>
    <div class="box-info statistics">
      <h1>Statistics</h1>
    </div>
  </div>


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
		background-color: var(--lite-grey);
		border-radius: 30px;
		height: 80%;
		width: 80%;
	}

	.friends{
		grid-column: 1 / 2;
		grid-row: 1 / 3;
	}


  .lineFriend{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    /* border-top: solid 2px var(--grey); */
    background-color: var(--lite-lite-lite-grey);

  }

  .lineFriend:nth-child(2n + 1){

    background-color: var(--lite-lite-grey);
  }

  /* .lineFriend:last-child {
    border-bottom: solid 2px var(--grey);
  } */

  .lineFriend .name {
    margin-left: 10px;
  }

  .deleteFriendBtn {
    background-color: aliceblue;
    border: solid 2px black;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }

  .btnImage {
    height: 25px;
    width: 25px;
  }


</style>