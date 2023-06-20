<script lang="ts">
  import axios from "../../../axios.config";
  import type { User } from "../../../types";
  import { Status } from "../../../types";
  import { handleImageError } from "../../../utils";
  import { reloadImage, id, socket, logged, user } from "../../../stores";
  import deleteIcon from "../../../assets/new_cross.png";
  import acceptIcon from "../../../assets/new_check.png";

  export let pageUser: User
  export let onlineStatus: Status

  let isBlocked: boolean = false;

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

<div class="ctn-infos">
  <div class="ctn-image">
    <img class="image" src="{COMMON_BASE_URL}:3000/images/actual/{pageUser.id}?$reload=${$reloadImage}" on:error={handleImageError} alt="profil"/>
  </div>
  <br>
  <div class="ctn-title">
    <h1 class="title">{pageUser.username}</h1>
  </div>
  <br>
	{#if pageUser.id.toString() === $id}
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => logout()}>Logout</button>
  {:else}
    <!-- online status -->
		{#if onlineStatus === Status.offline}
      <div class="badge badge-error gap-2">
        offline
      </div>
		{:else if onlineStatus === Status.online}
      <div class="badge badge-success gap-2">
        online
      </div>
		{:else if onlineStatus === Status.ingame}
      <div class="badge badge-info gap-2">
        ingame
      </div>
		{/if}
    <br>
    <br>
    <!--friendship -->
	  {#if pageUser.friends.some((user) => user.id.toString() === $id)}
      <button class="btn" on:click={removeFriendById}>Remove friend</button>
		{:else if pageUser.requestFriends.some((user) => user.id.toString() === $id)}
      <button class="btn" on:click={cancelFriendshipRequestById}>Cancel friendship request</button>
		{:else if pageUser.pendingFriends.some((user) => user.id.toString() === $id)}
    <span>
      <button class="btn no-animation">This user requested you as friend</button>
		  <button class="btn btn-square btn-outline" on:click={acceptFriendshipRequestById}>
				<img class="button-image" src={acceptIcon} alt="accept"/>
      </button>
		  <button class="btn btn-square btn-outline" on:click={dismissFriendshipRequestById}>
				<img class="button-image" src={deleteIcon} alt="dismiss"/>
      </button>
    </span>
		{:else}
      <button class="btn" on:click={requestFriendship}>Request friend</button>
      <br>
      <br>
		{/if}
    <br>
    <br>
    <br>
    <br>
    <br>
    <!--blocked -->
		{#if isBlocked === true}
      <button on:click={unblockByUsername} class="btn">Unblock</button>
		{:else}
      <button on:click={blockByUsername} class="btn">Block</button>
		{/if}
  {/if}
</div>

<style>

.ctn-infos {
  display: grid;
}

.ctn-title {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 50px;
  text-shadow: 0 0 20px;
  font-family: "Courier New", Courier, monospace;
  letter-spacing: 0.5px;
  color: var(--pink);
}

.ctn-image {
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
}

.image {
  /* position: relative; */
  /* pointer-events: none; */
  /* background-color: var(--grey); */
  border-radius: var(--imageRadius);
  height: 200px;
  width: 200px;
  border: solid 6px var(--lite-grey);
}

.button-image {
  height: 25px;
  width: 25px;
  float: right;
}

</style>