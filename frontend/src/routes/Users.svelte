<script lang="ts">
  import axios from "../axios.config";
  import { id, user, logged, socket } from "../stores";
  import type { Status, User } from "../types";
  import Friends from "./usersComponents/user-info/Friends.svelte";
  import Stats from "./usersComponents/user-info/Stats.svelte";
  import Settings from "./usersComponents/user-info/Settings.svelte";
  import Infos from "./usersComponents/user-info/Infos.svelte";

  export let params: any;

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
      const response = await axios.get("/auth/whoami");
      user.set(response.data);
      logged.set("true");
      id.set(response.data.id.toString());
      isBlocked = pageUser.blockedBy.some(blocked => blocked.id.toString() === $id)
    } catch (e) {
      logged.set("false");
      id.set("0");
    }
  }

  async function selectprofile() {

    if (params.name == $user.username) {
      pageUser = $user
      return
    }

    try {
      const response = await axios.get(`/users/${params.name}`)
      pageUser = response.data
      $socket.emit('getOnlineStatus', pageUser.username, (response: Status) => {
        onlineStatus = response
      })
    } catch(e) {
      console.log(e)
    }
  }

</script>

<div class="component">

  <Infos bind:pageUser bind:onlineStatus/>

  <Friends bind:pageUser/>

  <Stats bind:pageUser/>

  {#if pageUser.id.toString() === $id}
    <Settings bind:pageUser/>
  {/if}

</div>

<style>

  .component {
    height: 100%;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-auto-rows: 500px;
    grid-auto-columns: 500px;
    overflow-y: scroll;
  }

  @media screen and (max-width: 1200px) {
    .component {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }
  }

</style>
