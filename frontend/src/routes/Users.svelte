<script lang="ts">


import axios from "axios";
  import { onMount } from "svelte";
  import { id, reloadImage, user } from "../stores";
  import type { User} from "../types";
  import UsersInfo from "./usersComponents/UsersInfo.svelte";
  import UsersSettings from "./usersComponents/UsersSettings.svelte";
  import NotFound from "./NotFound.svelte";


  export let params;

  const name = params.name

  let settings: boolean = false;

  let pageUser: User = {
      id: 0,
      username: null,
      password: null,
      mmr: null,
      games: null,
      ft_login: null,
      friends: [],
      friendOf: [],
      pendingFriends: [],
      requestFriends: [],

    }

    $: {
      const { name: newName } = params.name;
      if (newName !== name) {
        selectUser();
      }
    }


    $: onMount(() => selectUser())

  async function getUser(): Promise <User> {
      return (await axios.get(`http://localhost:3000/users/${params.name}`, { withCredentials: true })).data
    }

    async function selectUser() {
    if (params.name != $user.username)
    {
      console.log("changement de uesr")
      pageUser = await getUser();
    }
    else
    pageUser = $user;
  }

  async function requestFriendship() {
    try {
      await axios.post(`http://localhost:3000/users/friendship/request/${pageUser.id}`, null, { withCredentials: true })
      getUser()
    } catch (error) {
      console.log(error)
    }
  }


</script>

{#if pageUser.username != null}

<div class="component">
  <div class="user-panel">

    <h1 class="title">Profile</h1>

    <!-- toggle edditing button (class after) -->
    {#if pageUser.id.toString() == $id}
      <button class="image-button imageAfter" on:click={() => settings = !settings}>
        <img class="image" src="http://localhost:3000/images/actual/{pageUser.id}?$reload=${$reloadImage}" alt="profil">
      </button>

      <button class="username-button usernameAfter" on:click={() => settings = !settings}>
        <span class="username">{pageUser.username}</span>
      </button>

      <button class="twofa-button twofaAfter" on:click={() => settings = !settings}>
        <p class="twofa">Your 2FA  is not activated</p>
      </button>
    {:else}
      <button class="image-button" on:click={() => settings = !settings}>
        <img class="image" src="http://localhost:3000/images/actual/{pageUser.id}?$reload=${$reloadImage}" alt="profil">
      </button>

      <button class="username-button" on:click={() => settings = !settings}>
        <span class="username">{pageUser.username}</span>
      </button>

      <button class="friendrequest" on:click={() => requestFriendship()}>friends request</button>
    {/if}



  </div>

  <div class="second-panel">
    {#if settings}
      <UsersSettings/>
    {:else}
      <UsersInfo bind:pageUser={pageUser}/>
    {/if}
  </div>

</div>

{:else}
  <NotFound/>
{/if}






<style>

  .component {
    height: 100vh;
    display: grid;
    grid-template-columns: 320px 1fr;
    background-color: var(--black);
  }

  .user-panel {
    height: 100%;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    background-color: var(--grey);
    border: solid 1px var(--lite-grey);
    border-top-width: 0;
    border-bottom-width: 0;

  }


  .user-panel .title {
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
  }

  .user-panel .image-button {
    position: relative;
    pointer-events: none;
    background-color: var(--grey);
    border: none;
  }

  .user-panel .imageAfter:after {
    position: absolute;
    content: "\2699";
    font-size: 1.5em;
    pointer-events: all;
    height: 40px;
    width: 40px;
    background-color: var(--lite-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    left: 100%;
    top: 0;
    transform: translate(-110%, 0px);
  }

  .user-panel .image-button .image {
    border-radius: var(--imageRadius);
    height: 200px;
    width: 200px;
    position: relative;
    pointer-events: none;
    border: solid 6px var(--lite-grey);
  }

  .user-panel .username-button {
    position: relative;
    pointer-events: none;
  }

  .user-panel .username-button .username {
    font-size: 50px;
    color: var(--white);

  }

  .user-panel .usernameAfter:after {
    position: absolute;
    content: "\2699";
    font-size: 1.2em;
    pointer-events: all;
    height: 30px;
    width: 30px;
    background-color: var(--lite-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    left: 100%;
    top: 0;


  }

  .user-panel .twofa-button .twofa {
    color: var(--white);
  }

  .user-panel .twofa-button {
    position: relative;
  }

  .user-panel .twofaAfter:after {
    position: absolute;
    content: "\2699";
    font-size: 1.2em;
    pointer-events: all;
    height: 30px;
    width: 30px;
    background-color: var(--lite-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    left: 100%;
    top: 0;
    transform: translate(6px, -20px);
  }

  .friendrequest {
    background-color: aliceblue;
    border: solid 2px black;
    border-radius: 5px;
  }

  .second-panel {
    grid-column: 2 / 3;
    background-color: var(--grey);
    overflow-y: scroll;
  }

</style>
