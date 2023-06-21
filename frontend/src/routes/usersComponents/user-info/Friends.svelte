<script lang="ts">

  import axios from "../../../axios.config";
  import { id } from "../../../stores";
  import type { User } from "../../../types";
  import deleteIcon from "../../../assets/new_cross.png";
  import acceptIcon from "../../../assets/new_check.png";
  import { handleImageError } from "../../../utils";

  export let pageUser: User;

  const enum Tab {
    Friends,
    Request,
    Pending,
    Blocked
  }

  let tab: Tab = Tab.Friends

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

<div class="box-info">
    {#if $id === pageUser.id.toString()}
      <div class="nav">
        <button on:click={() => tab = Tab.Friends} class={tab === Tab.Friends ? 'activeButton' : undefined}>Friends</button>
        <button on:click={() => tab = Tab.Request} class={tab === Tab.Request ? 'activeButton' : undefined}>Request</button>
        <button on:click={() => tab = Tab.Pending} class={tab === Tab.Pending ? 'activeButton' : undefined}>Pending</button>
        <button on:click={() => tab = Tab.Blocked} class={tab === Tab.Blocked ? 'activeButton' : undefined}>Blocked</button>
      </div>
    {:else}
      <h1>Friends</h1>
    {/if}

    {#if tab === Tab.Friends}
      <div class="overflow">
        <ul>
          {#each pageUser.friends as friend}
            <li>
              <div class="user">
                <img class="pp" src="{COMMON_BASE_URL}:3000/images/actual/{friend.id}" on:error={handleImageError} alt="pp"/>
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
    {:else if tab === Tab.Request && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.requestFriends as requestFriends}
            <li>
              <div class="user">
                <img class="pp" src="{COMMON_BASE_URL}:3000/images/actual/{requestFriends?.id}" on:error={handleImageError} alt="pp"/>
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
    {:else if tab === Tab.Pending && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.pendingFriends as pendingFriends}
            <li>
              <div class="user">
                <img class="pp" src="{COMMON_BASE_URL}:3000/images/actual/{pendingFriends?.id}" on:error={handleImageError} alt="pp"/>
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
    {:else if tab === Tab.Blocked && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.blocked as blocked}
            <li>
              <div class="user">
                <img class="pp" src="{COMMON_BASE_URL}:3000/images/actual/{blocked.id}" on:error={handleImageError} alt="pp"/>
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
  .box-info {
    border: solid 2px var(--grey);
    box-shadow: 0 0 10px var(--lite-grey);
    background-color: var(--lite-grey);
    border-radius: 20px;
    height: 80%;
    width: 80%;
    display: flex;
    flex-direction: column;
  }

  .pp {
    width: 35px;
    height: 35px;
    border: 1px solid rgb(78, 78, 78);
    border-radius: 50%;
  }

  h1 {
    height: 40px;
    border-bottom: solid 1px black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  li {
    height: 40px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    background-color: var(--lite-lite-lite-grey);
  }

  li:nth-child(2n + 1) {
    background-color: var(--lite-lite-grey);
  }

  .box-info .user {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5%;
  }

  .box-info .user .name {
    margin-left: 5%;
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 5%;
    gap: 5px;
  }

  .box-info .nav {
    height: 40px;
    display: flex;
    justify-content: space-around;
  }

  .box-info .nav button {
    border-bottom: solid 1px var(--black);
    flex: auto;
  }

  .box-info .nav .activeButton {
    border-bottom: none;
  }

  .box-info .nav button:not(:last-child) {
    border-right: solid 1px var(--black);
  }

  .actionsButton {
    background-color: var(--white);
    border: solid 2px black;
    border-radius: 50%;
    height: 35px;
    width: 35px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
  }

  .btnImage {
    height: 25px;
    width: 25px;
  }

  .overflow {
    flex: 1;
    overflow: auto;
    border-radius: 0 0 30px 30px;
  }

  *::-webkit-scrollbar {
    display: none;
  }

</style>
