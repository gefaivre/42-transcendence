<script lang="ts">
    import axios from "../../axios.config";
		import { id, logged, user } from "../../stores";
    import deleteIcon        from '../../assets/redLose.png';
    import { onMount } from "svelte";
    import type { User } from "../../types";


    export let pageUser;
    export let params;


    let friendspage: String = 'Friends';


    $: onMount(() => reload())


    async function reload() {
      getUser();
      selectprofile();
    }

    async function getUser() {
      try {
        let response = await axios.get('/auth/whoami');
        // let response = await axios.get('/users/gefaivre');
        user.set(response.data)
        console.log($user)
        logged.set('true')
        id.set(response.data.id.toString())
      } catch (error) {
        logged.set('false')
        id.set('0')
      }
    }

    async function getprofile(): Promise <User> {
      return (await axios.get(`/users/${params.name}`)).data
    }

    async function selectprofile() {
    if (params.name != $user.username)
    {
    console.log("changement de uesr")
    pageUser = await getprofile();
    console.log(pageUser)
    }
    else
    pageUser = $user;
    }


    async function requestFriendship() {
      try {
        await axios.post(`/users/friendship/request/${pageUser.id}`, null)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function acceptFriendshipRequestById() {
      try {
        await axios.post(`/users/friendship/acceptById/${$user.id}`, null)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function acceptFriendshipRequestByName(name: string) {
      try {
        await axios.post(`/users/friendship/acceptByName/${name}`, null)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function dismissFriendshipRequestById() {
      try {
        await axios.post(`/users/friendship/dismissById/${$user.id}`, null)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function dismissFriendshipRequestByName(name: string) {
      try {
        await axios.post(`/users/friendship/dismissByName/${name}`, null)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function cancelFriendshipRequestById() {
      try {
        const cancel = await axios.post(`/users/friendship/cancelById/${$user.id}`, null)
        console.log(cancel)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function cancelFriendshipRequestByName(name: string) {
      try {
        const cancel = await axios.post(`/users/friendship/cancelByName/${name}`, null)
        console.log(cancel)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function removeFriendById() {
      try {
        const cancel = await axios.post(`/users/friendship/removeById/${$user.id}`, null)
        console.log(cancel)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

    async function removeFriendByName(name: string) {
      try {
        const cancel = await axios.post(`/users/friendship/removeByName/${name}`, null)
        console.log(cancel)
        reload()
      } catch (error) {
        console.log(error)
      }
    }

</script>

	<div class="info-container">

    <div class="box-info friends">
      <h1> Friends</h1>
      <div class="nav">
        <button on:click={() => friendspage = 'Friends'}>friends</button>
        <button on:click={() => friendspage = 'Request'}>request</button>
        <button on:click={() => friendspage = 'Pending'}>pending</button>
      </div>

      {#if friendspage === 'Friends'}

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

    {:else if friendspage === 'Request' && $id === pageUser.id.toString()}

    <ul>
      {#each pageUser.requestFriends as requestFriends}
        <li>
          <b>{requestFriends?.username}</b> requested you as friend
          <button on:click={() => acceptFriendshipRequestByName(requestFriends.username)}>Accept</button>
          <button on:click={() => dismissFriendshipRequestByName(requestFriends.username)}>Dismiss</button>
        </li>
      {/each}
      </ul>


    {:else if friendspage === 'Pending'}

      <ul>
        {#each pageUser.pendingFriends as pendingFriends}
          <li>
            You requested <b>{pendingFriends?.username}</b> as friend
            <button  on:click={() => cancelFriendshipRequestByName(pendingFriends.username)}>Cancel</button>
          </li>
        {/each}
      </ul>

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

  .friends .nav {
    display: flex;
    justify-content: space-around;
  }

  .friends .nav button {
    border-top: solid 1px var(--black);
    border-bottom: solid 1px var(--black);
    flex: auto;
  }

  .friends .nav button:nth-child(2) {
    border: solid 1px var(--black);
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