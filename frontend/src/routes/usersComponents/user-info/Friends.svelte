<script lang="ts">

  import axios from "../../../axios.config";
  import { id } from "../../../stores";
  import type { User } from "../../../types";
  import deleteIcon from "../../../assets/redLose.png";
  import acceptIcon from "../../../assets/greenWin.png";


  export let pageUser: User;
  let friendspage: String = "Friends";

  async function removeFriendByName(name: string) {
    try {
      await axios.post(`/users/friendship/removeByName/${name}`,null);

      let index = pageUser.friends.findIndex(friend => friend.username === name)
      pageUser.friends.splice(index, 1)

      index = pageUser.friendOf.findIndex(friend => friend.username === name)
      pageUser.friendOf.splice(index, 1)

      pageUser = pageUser

    } catch (e) {
      console.log(e);
    }
  }

  async function acceptFriendshipRequestByName(name: string) {
    try {
      const response = await axios.post(`/users/friendship/acceptByName/${name}`, null);

      //update pageUser
      const index = pageUser.requestFriends.findIndex(friend => friend.username === name)
      pageUser.requestFriends.splice(index, 1)

      const friend = response.data.friends.find((friend: any) => friend.username === name)
      pageUser.friends.unshift({ id: friend.id, username: name })

      pageUser = pageUser

    } catch (e) {
      console.log(e);
    }
  }

  async function dismissFriendshipRequestByName(name: string) {
    try {
      await axios.post(`/users/friendship/dismissByName/${name}`, null);

      const index = pageUser.requestFriends.findIndex(friend => friend.username === name)
      pageUser.requestFriends.splice(index, 1)

      pageUser = pageUser

    } catch (e) {
      console.log(e);
    }
  }

  async function cancelFriendshipRequestByName(name: string) {
    try {
      await axios.post(`/users/friendship/cancelByName/${name}`,null);

      const index = pageUser.pendingFriends.findIndex(friend => friend.username === name)
      pageUser.pendingFriends.splice(index, 1)

      pageUser = pageUser

    } catch (e) {
      console.log(e);
    }
  }

  async function unblockByUsername(username: string) {
    try {
      await axios.patch(`/users/unblock/${username}`, null);
    } catch (e) {
      console.log(e);
    }
  }

</script>

<div class="box-info friends">
    {#if $id === pageUser.id.toString()}
      <div class="nav">
        {#if friendspage == "Friends"}
          <button class="activeButton" on:click={() => (friendspage = "Friends")}>friends</button>
        {:else}
          <button on:click={() => (friendspage = "Friends")}>friends</button>
        {/if}

        {#if friendspage == "Request"}
          <button class="activeButton" on:click={() => (friendspage = "Request")}>request</button>
        {:else}
          <button on:click={() => (friendspage = "Request")}>request</button>
        {/if}

        {#if friendspage == "Pending"}
          <button class="activeButton" on:click={() => (friendspage = "Pending")}>pending</button>
        {:else}
          <button on:click={() => (friendspage = "Pending")}>pending</button>
        {/if}

        {#if friendspage == "Blocked"}
          <button class="activeButton" on:click={() => (friendspage = "Blocked")}>blocked</button>
        {:else}
          <button on:click={() => (friendspage = "Blocked")}>blocked</button>
        {/if}
      </div>
    {:else}
      <h1>Friends</h1>
    {/if}

    {#if friendspage == "Friends"}
      <div class="overflow">
        <ul>
          {#each pageUser.friends as friend}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{friend.id}" alt="pp"/>
                <a class="name" href="#/users/{friend.username}">{friend.username}</a>
              </div>
              {#if $id === pageUser.id.toString()}
                <div class="actions">
                  <button class="actionsButton"
                    on:click={() => removeFriendByName(friend.username)}>
                    <img class="btnImage" src={deleteIcon} alt="deleteicon"/>
                  </button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {:else if friendspage == "Request" && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.requestFriends as requestFriends}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{requestFriends?.id}" alt="pp"/>
                <a class="name" href="#/users/{requestFriends?.username}">
                  {requestFriends?.username}
                </a>
              </div>
              <div class="actions">
                <button class="actionsButton"
                  on:click={() => acceptFriendshipRequestByName(requestFriends.username)}>
                  <img class="btnImage" src={acceptIcon} alt="accept" />
                </button>
                <button class="actionsButton"
                  on:click={() => dismissFriendshipRequestByName(requestFriends.username)}>
                  <img class="btnImage" src={deleteIcon} alt="delete" />
                </button>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {:else if friendspage == "Pending" && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.pendingFriends as pendingFriends}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{pendingFriends?.id}" alt="pp"/>
                <a class="name" href="#/users/{pendingFriends?.username}">
                  {pendingFriends?.username}</a>
              </div>
              <div class="actions">
                <button
                  class="actionsButton"
                  on:click={() => cancelFriendshipRequestByName(pendingFriends.username)}>
                  <img class="btnImage" src={deleteIcon} alt="delete" />
                </button>
              </div>
            </li>
          {/each}
        </ul>
      </div>
    {:else if friendspage == "Blocked" && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.blocked as blocked}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{blocked.id}"alt="pp"/>
                <a class="name" href="#/users/{blocked.username}"> {blocked.username}</a>
              </div>
              {#if $id === pageUser.id.toString()}
                <div class="actions">
                  <button class="actionsButton"
                    on:click={() => unblockByUsername(blocked.username)}>
                    <img class="btnImage" src={deleteIcon} alt="deleteicon"/>
                  </button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>

<style>

</style>
