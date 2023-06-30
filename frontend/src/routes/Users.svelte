<script lang="ts">
  import axios from "../axios.config";
  import { id, user, socket } from "../stores";
  import type { Status, User } from "../types";
  import Friends from "./usersComponents/user-info/Friends.svelte";
  import Stats from "./usersComponents/user-info/Stats.svelte";
  import Settings from "./usersComponents/user-info/Settings.svelte";
  import Infos from "./usersComponents/user-info/Infos.svelte";
  import { toast } from '@zerodevx/svelte-toast/dist'

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
    if (params != undefined)
    {
      const { newName } = params.name;
      if (newName !== name) {
        selectprofile();
      }
    }
  }

  async function selectprofile() {

    if (params == undefined || params.name === $user.username) {
      pageUser = $user
      return
    }

    try {

      // get user
      const response = await axios.get(`/users/${params.name}`)
      pageUser = response.data

      // get online status
      $socket.emit('getOnlineStatus', pageUser.username, (response: Status) => {
        onlineStatus = response
      })

      // get blocked status
      isBlocked = pageUser.blockedBy.some(blocked => blocked.id.toString() === $id)
    } catch(e) {
      toast.push(e.response.data.message, {classes: ['failure']})
    }
  }

</script>

{#await selectprofile() then _}

<div class="component">

  <Infos bind:pageUser bind:onlineStatus bind:isBlocked/>

  <Friends bind:pageUser/>

  <Stats bind:pageUser/>

  {#if pageUser.id.toString() === $id}
    <Settings bind:pageUser/>
  {/if}

</div>

{/await}

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

  @media screen and (max-width: 1300px) {
    .component {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr;
    }
  }

</style>
