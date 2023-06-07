<script lang="ts">
import axios from "../../axios.config";
import { id, user, reloadImage, logged, socket} from "../../stores";
import { Status, type User } from "../../types";
import deleteIcon from "../assets/redLose.png";
import acceptIcon from "../assets/greenWin.png";


export let pageUser: User;
let settings: boolean = false;
let isBlocked: boolean = false;
let onlineStatus: Status = null;


async function logout() {
    try {
      await axios.get("/auth/logout");
      logged.set("false");
      id.set("0");
      if ($socket !== null && $socket !== undefined)
        $socket.disconnect()
    } catch (e) {
      console.log(e);
    }
  }

  async function requestFriendship() {
    try {
      await axios.post(`/users/friendship/request/${pageUser.id}`, null);

      pageUser.requestFriends.unshift({ id: $user.id, username: $user.username })
      $user.pendingFriends.unshift({ id: pageUser.id, username: pageUser.username })

      pageUser = pageUser
      $user = $user
    } catch (e) {
      console.log(e);
    }
  }

  async function removeFriendById() {
    try {
      await axios.post(`/users/friendship/removeById/${pageUser.id}`, null);

      let index = $user.friends.findIndex(friend => friend.username === pageUser.username)
      $user.friends.splice(index, 1);

      index = pageUser.friends.findIndex(friend => friend.username === $user.username)
      pageUser.friends.splice(index, 1);

      pageUser = pageUser
      $user = $user

    } catch (e) {
      console.log(e);
    }
  }

  async function cancelFriendshipRequestById() {
    try {
      await axios.post(`/users/friendship/cancelById/${pageUser.id}`,null);

      let index = $user.pendingFriends.findIndex(friend => friend.username === pageUser.username)
      $user.pendingFriends.splice(index, 1);

      index = pageUser.requestFriends.findIndex(friend => friend.username === $user.username)
      pageUser.requestFriends.splice(index, 1);

      console.log($user.friends)

      pageUser = pageUser
      $user = $user

    } catch (e) {
      console.log(e);
    }
  }

  async function acceptFriendshipRequestById() {
    try {
      await axios.post(`/users/friendship/acceptById/${pageUser.id}`, null);


      //delete request
      let index = $user.pendingFriends.findIndex(friend => friend.username === pageUser.username)
      $user.pendingFriends.splice(index, 1);

      index = pageUser.requestFriends.findIndex(friend => friend.username === $user.username)
      pageUser.requestFriends.splice(index, 1);

      //add friendship
      pageUser.friends.unshift({ id: $user.id, username: $user.username })
      $user.friends.unshift({ id: pageUser.id, username: pageUser.username })

      pageUser = pageUser
      $user = $user

    } catch (e) {
      console.log(e);
    }
  }

  async function blockByUsername() {
    try {
      await axios.patch(`/users/block/${pageUser.username}`, null);
      isBlocked = true;
    } catch (e) {
      console.log(e);
    }
  }

  async function unblockByUsername() {
    try {
      await axios.patch(`/users/unblock/${pageUser.username}`, null);
      isBlocked = false;
    } catch (e) {
      console.log(e);
    }
  }

  async function dismissFriendshipRequestById() {
    try {
      await axios.post(`/users/friendship/dismissById/${pageUser.id}`, null);

      let index = $user.requestFriends.findIndex(friend => friend.username === pageUser.username)
      $user.requestFriends.splice(index, 1);

      index = pageUser.pendingFriends.findIndex(friend => friend.username === $user.username)
      pageUser.pendingFriends.splice(index, 1);

      pageUser = pageUser
      $user = $user

    } catch (e) {
      console.log(e);
    }
  }



</script>

<div class="user-panel">
	<div class="ctn-title">
	  <h1 class="title">{pageUser.username}</h1>
	</div>

	<div class="ctn-image">
	  <img
		class="image"
		src="http://localhost:3000/images/actual/{pageUser.id}?$reload=${$reloadImage}"
		alt="profil"
	  />
	</div>

	{#if pageUser.id.toString() === $id}
	  <div class="ctn-action">
		<ul>
		  <li>
			<span>settings</span>
			<div class="actions">
			  <button class="actionButton" on:click={() => (settings = !settings)}>
				<img class="btnImage" src={acceptIcon} alt="delete" />
			  </button>
			</div>
		  </li>
		  <li>
			<span>logout</span>
			<div class="actions">
			  <button class="actionButton" on:click={() => logout()}>
				<img class="btnImage" src={deleteIcon} alt="delete" />
			  </button>
			</div>
		  </li>
		</ul>
	  </div>
	{:else}
	  <div class="ctn-action">
		<ul>
		  {#if pageUser.friends.some((user) => user.id.toString() === $id)}
			<li>
			  <span>This user is your friend !</span>
			  <div class="actions">
				<button class="actionButton" on:click={removeFriendById}>
				  <img class="btnImage" src={deleteIcon} alt="delete" />
				</button>
			  </div>
			</li>
		  {:else if pageUser.requestFriends.some((user) => user.id.toString() === $id)}
			<li>
			  <span>Pending friend invitation...</span>
			  <div class="actions">
				<button class="actionButton" on:click={cancelFriendshipRequestById}>
				  <img class="btnImage" src={deleteIcon} alt="delete" />
				</button>
			  </div>
			</li>
		  {:else if pageUser.pendingFriends.some((user) => user.id.toString() === $id)}
			<li>
			  <span>Accept invitation</span>
			  <div class="actions">
				<button class="actionButton" on:click={acceptFriendshipRequestById}>
				  <img class="btnImage" src={acceptIcon} alt="delete" />
				</button>
				<button class="actionButton" on:click={dismissFriendshipRequestById}>
				  <img class="btnImage" src={deleteIcon} alt="delete" />
				</button>
			  </div>
			</li>
		  {:else}
			<li>
			  <span>Request friends</span>
			  <div class="actions">
				<button class="actionButton" on:click={requestFriendship}>
				  <img class="btnImage" src={acceptIcon} alt="delete" />
				</button>
			  </div>
			</li>
		  {/if}

		  <li>
			{#if isBlocked === true}
			  <span>This user is blocked </span>
			  <div class="actions">
				<button class="actionButton" on:click={unblockByUsername}>
				  <img class="btnImage" src={deleteIcon} alt="delete" />
				</button>
			  </div>
			{:else}
			  <span>This user is not blocked </span>
			  <div class="actions">
				<button class="actionButton" on:click={blockByUsername}>
				  <img class="btnImage" src={deleteIcon} alt="delete" />
				</button>
			  </div>
			{/if}
		  </li>

		  <li>
			{#if onlineStatus === Status.offline}
			  <span>This user is offline</span>
			{:else if onlineStatus === Status.online}
			  <span>This user is online</span>
			{:else if onlineStatus === Status.ingame}
			  <span>This user is ingame</span>
			{/if}
		  </li>
		</ul>
	  </div>
	{/if}
  </div>

<style>
	
</style>

