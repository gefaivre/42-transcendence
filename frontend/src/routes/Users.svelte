<script lang="ts">


  import axios from "../axios.config";
    import { onMount } from "svelte";
    import { id, reloadImage, user, logged } from "../stores";
    import type { User} from "../types";
    import UsersInfo from "./usersComponents/UsersInfo.svelte";
    import UsersSettings from "./usersComponents/UsersSettings.svelte";
    import NotFound from "./NotFound.svelte";
    import deleteIcon        from '../assets/redLose.png';
    import acceptIcon        from '../assets/greenWin.png';
    import { update_keyed_each } from "svelte/internal";


    export let params;

    const name = params.name

    let settings: boolean = false;

    let isBlocked: boolean = false;

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
          let response = await axios.get('/auth/whoami');
          // let response = await axios.get('/users/gefaivre');
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
      } catch (e) {
        console.log(e)
      }
    }

    async function logout() {
      try {
        await axios.get('/auth/logout')
        logged.set('false')
        id.set('0')
      } catch (e) {
        console.log(e)
      }
    }

    async function removeFriendById() {
      try {
        await axios.post(`/users/friendship/acceptByName/${name}`, null)
        getUser()
        reload()
      } catch (e) {
        console.log(e)
      }
    }

    async function dismissFriendshipRequestById() {
      try {
        await axios.post(`/users/friendship/dismissById/${pageUser.id}`, null)
        getUser()
        reload()
      } catch (e) {
        console.log(e)
      }
    }

    async function cancelFriendshipRequestById() {
      try {
        const cancel = await axios.post(`/users/friendship/cancelById/${pageUser.id}`, null)
        console.log(cancel)
        getUser()
        reload()
      } catch (e) {
        console.log(e)
      }
    }

    async function acceptFriendshipRequestById() {
      try {
        await axios.post(`/users/friendship/acceptById/${pageUser.id}`, null)
        reload()
      } catch (e) {
        console.log(e)
      }
    }



    async function blockUser() {
      isBlocked = ! isBlocked;
    }



  </script>

  {#if pageUser.username != null}

  <div class="component">

    <div class="user-panel">

      <div class="ctn-title">
        <h1 class="title">{pageUser.username}</h1>
      </div>

      <div class="ctn-image">
        <img class="image" src="http://localhost:3000/images/actual/{pageUser.id}?$reload=${$reloadImage}" alt="profil">
      </div>


      {#if pageUser.id.toString() === $id}

        <div class="ctn-action">
          <ul>
            <li>
              <span>settings</span>
              <div class="actions">
                <button class="actionButton" on:click={() => settings = !settings}>
                  <img class="btnImage" src={acceptIcon} alt="delete">
                </button>
              </div>
            </li>
            <li>
              <span>logout</span>
              <div class="actions">
                <button class="actionButton" on:click={() => logout()}>
                  <img class="btnImage" src={deleteIcon} alt="delete">
                </button>
              </div>
            </li>
          </ul>
        </div>

      {:else}

        <div class="ctn-action">
          <ul>
            {#if pageUser.friends.some(user => user.id.toString() === $id)}
            <li>
              <span>This user is your friend !</span>
              <div class="actions">
                <button class="actionButton" on:click={removeFriendById}>
                  <img class="btnImage" src={deleteIcon} alt="delete">
                </button>
              </div>
            </li>
            {:else if pageUser.requestFriends.some(user => user.id.toString() === $id)}
            <li>
              <span>Pending friend invitation...</span>
              <div class="actions">
                <button class="actionButton" on:click={cancelFriendshipRequestById}>
                  <img class="btnImage" src={deleteIcon} alt="delete">
                </button>
              </div>
            </li>
            {:else if pageUser.pendingFriends.some(user => user.id.toString() === $id)}
            <li>
              <span>Accept invitation</span>
              <div class="actions">
                <button class="actionButton" on:click={acceptFriendshipRequestById}>
                  <img class="btnImage" src={acceptIcon} alt="delete">
                </button>
                <button class="actionButton" on:click={dismissFriendshipRequestById}>
                  <img class="btnImage" src={deleteIcon} alt="delete">
                </button>
              </div>
            </li>
            {:else}
            <li>
              <span>Request friends</span>
              <div class="actions">
                <button class="actionButton" on:click={requestFriendship}>
                  <img class="btnImage" src={acceptIcon} alt="delete">
                </button>
              </div>
            </li>
            {/if}

            <li>
              {#if isBlocked}
                <span>This user is blocked </span>
              {:else}
                <span>This user is not blocked </span>
              {/if}
              <div class="actions">
                <button class="actionButton" on:click={blockUser}>
                  <img class="btnImage" src={deleteIcon} alt="delete">
                </button>
              </div>
            </li>

          </ul>
        </div>
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

  .component {
    height: 100%;
    display: grid;
    grid-template-columns: 320px 1fr;
    background-color: var(--black);
  }

  .user-panel {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 2fr 3fr;
    background-color: var(--grey);
    border-left: solid 1px var(--lite-grey);
    border-right: solid 1px var(--lite-grey);
  }


  .ctn-title {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .title {
    font-size: 50px;
    text-shadow: 0 0 20px;
    font-family: 'Courier New', Courier, monospace;
    letter-spacing: 0.5px;
    color: var(--pink);
  }

  .ctn-image {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image {
    position: relative;
    pointer-events: none;
    background-color: var(--grey);
    border-radius: var(--imageRadius);
    height: 200px;
    width: 200px;
    position: relative;
    pointer-events: none;
    border: solid 6px var(--lite-grey);
  }

  .ctn-action {
    display: grid;
    align-items: end;
  }


  .ctn-action li{
    height: 40px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    background-color: var(--lite-lite-grey);
  }

  .ctn-action li:nth-child(2n + 1){
    background-color: var(--lite-grey);
  }

  .ctn-action span {
    display: flex;
    align-items: center;
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 5%;
    gap: 5px;
  }

  .actionButton {
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




  .second-panel {
    grid-column: 2 / 3;
    background-color: var(--grey);
    overflow-y: auto;
  }

</style>
