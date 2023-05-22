<script lang="ts">


  import axios from "axios";
    import { onMount } from "svelte";
    import { id, reloadImage, user, logged } from "../stores";
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
        TwoFA: false,
      }

      $: {
        const { name: newName } = params.name;
        if (newName !== name) {
          reload();
        }
      }


      $: onMount(() => reload())


      async function reload() {
        getUser();
        selectprofile();
      }

      async function getUser() {
        try {
          let response = await axios.get('http://localhost:3000/auth/whoami', {withCredentials: true});
          // let response = await axios.get('http://localhost:3000/users/gefaivre', {withCredentials: true});
          user.set(response.data)
          console.log($user)
          logged.set('true')
          id.set(response.data.id.toString())
        } catch (e) {
          logged.set('false')
          id.set('0')
        }
      }

    async function getprofile(): Promise <User> {
        return (await axios.get(`http://localhost:3000/users/${params.name}`, { withCredentials: true })).data
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
        await axios.post(`http://localhost:3000/users/friendship/request/${pageUser.id}`, null, { withCredentials: true })
        reload()
      } catch (e) {
        console.log(e)
      }
    }

    async function logout() {
      try {
        await axios.get('http://localhost:3000/auth/logout', { withCredentials: true })
        logged.set('false')
        id.set('0')
      } catch (e) {
        console.log(e)
      }
    }

    async function removeFriendById() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/acceptByName/${name}`, null, { withCredentials: true })
        getUser()
        reload()
      } catch (e) {
        console.log(e)
      }
    }

    async function dismissFriendshipRequestById() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/dismissById/${pageUser.id}`, null, { withCredentials: true })
        getUser()
        reload()
      } catch (e) {
        console.log(e)
      }
    }

    async function cancelFriendshipRequestById() {
      try {
        const cancel = await axios.post(`http://localhost:3000/users/friendship/cancelById/${pageUser.id}`, null, { withCredentials: true })
        console.log(cancel)
        getUser()
        reload()
      } catch (e) {
        console.log(e)
      }
    }

    async function acceptFriendshipRequestById() {
      try {
        await axios.post(`http://localhost:3000/users/friendship/acceptById/${pageUser.id}`, null, { withCredentials: true })
        reload()
      } catch (e) {
        console.log(e)
      }
    }



  </script>

  {#if pageUser.username != null}

  <div class="component">
    <div class="user-panel">

      <h1 class="title">Profile</h1>

      <!-- toggle edditing button (class after) -->
      {#if pageUser.id.toString() == $id}
        <button class="image-button">
          <img class="image" src="http://localhost:3000/images/actual/{pageUser.id}?$reload=${$reloadImage}" alt="profil">
        </button>

        <button class="username-button">
          <span class="username">{pageUser.username}</span>
        </button>


        <div>
          <button class="parameter" on:click={() => settings = !settings}>settings</button>
          <button class="logout" on:click={() => logout()}>logout</button>
        </div>
      {:else}
        <button class="image-button">
          <img class="image" src="http://localhost:3000/images/actual/{pageUser.id}?$reload=${$reloadImage}" alt="profil">
        </button>

        <button class="username-button">
          <span class="username">{pageUser.username}</span>
        </button>

        {#if pageUser.friends.some(user => user.id.toString() === $id)}
          <span style="color: white">This user is your friend !</span>
          <button on:click={removeFriendById}>Remove</button>
        {:else if pageUser.requestFriends.some(user => user.id.toString() === $id)}
        <span style="color: white">Pending friend invitation...</span>
          <button on:click={cancelFriendshipRequestById}>Cancel</button>
        {:else if pageUser.pendingFriends.some(user => user.id.toString() === $id)}
        <span style="color: white">This user requested you as friend</span>
          <button on:click={acceptFriendshipRequestById}>Accept</button>
          <button on:click={dismissFriendshipRequestById}>Dismiss</button>
        {:else}
          <button on:click={requestFriendship}>Request friendship</button>
        {/if}
      {/if}

    </div>

    <div class="second-panel">
      {#if settings}
        <UsersSettings/>
      {:else}
        <UsersInfo bind:pageUser={pageUser} bind:params={params}/>
      {/if}
    </div>

  </div>

  {:else}
    <NotFound/>
  {/if}






  <style>


    button {
      color: aliceblue;
    }

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

    .user-panel .logout, .user-panel .parameter {
    color: var(--white);
    }

    .second-panel {
      grid-column: 2 / 3;
      background-color: var(--grey);
      overflow-y: auto;
    }

  </style>
