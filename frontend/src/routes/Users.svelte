<script lang="ts">
  import axios from "../axios.config";
  import { id, user, logged, socket } from "../stores";
  import { Status, type User } from "../types";
  import UsersInfo from "./usersComponents/UsersInfo.svelte";
  import UsersSettings from "./usersComponents/UsersSettings.svelte";
  import NotFound from "./NotFound.svelte";
  import UsersPanel from "./usersComponents/UsersPanel.svelte";

  export let params;

  const name = params.name;

  let settings: boolean = false;

  let isBlocked: boolean = false;
  let onlineStatus: Status = null;

  let pageUser: User = {
    id: 0,
    username: null,
    password: null,
    mmr: null,
    games: null,
    ft_login: null,
    blocked: [],
    blockedBy: [],
    friends: [],
    friendOf: [],
    pendingFriends: [],
    requestFriends: [],
    TwoFA: false,
    date: null,
  };

  $: {
    const { newName } = params.name;
    if (newName !== name) {
      reload();
    }
  }

  async function reload() {
    getUser();
    selectprofile();
  }

  async function getUser() {
    try {
      let response = await axios.get("/auth/whoami");
      user.set(response.data);
      console.log($user);
      logged.set("true");
      id.set(response.data.id.toString());
      isBlocked = pageUser.blockedBy.some(
        (blocked: any) => blocked.id.toString() === $id
      );
    } catch (e) {
      logged.set("false");
      id.set("0");
    }
  }

  async function getprofile(): Promise<User> {
    return (await axios.get(`/users/${params.name}`)).data;
  }

  async function selectprofile() {
    if (params.name != $user.username) {
      pageUser = await getprofile();
      console.log(pageUser);
      $socket.emit('getOnlineStatus', pageUser.username, (response: Status) => {
        onlineStatus = response
      })
    } else pageUser = $user;
  }

</script>

{#if pageUser.username != null}
  <div class="component">

    <UsersPanel bind:pageUser bind:settings />

    <div class="second-panel">
      {#if settings}
        <UsersSettings />
      {:else}
        <UsersInfo bind:pageUser/>
      {/if}
    </div>
  </div>
{:else}
  <NotFound />
{/if}

<style>
  .component {
    height: 100%;
    display: grid;
    grid-template-columns: 320px 1fr;
    background-color: var(--black);
  }

  .second-panel {
    grid-column: 2 / 3;
    background-color: var(--grey);
    overflow-y: auto;
  }

</style>
