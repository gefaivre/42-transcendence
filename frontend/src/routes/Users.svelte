<script lang="ts">
  import axios from "../axios.config";
  import { id, user, logged, socket } from "../stores";
  import type { Status, User, Match, Stat } from "../types";
  import Friends from "./usersComponents/user-info/Friends.svelte";
  import Stats from "./usersComponents/user-info/Stats.svelte";
  import Settings from "./usersComponents/user-info/Settings.svelte";
  import Infos from "./usersComponents/user-info/Infos.svelte";

  export let params: any;

  let matchHistory: Match[] = [];

  let statistics: Stat = {
    lostGames: 0,
    wonGames: 0,
    totalGames: 0,
    ratioGames: 0,
    mmr: null,
    averageWin: { score: 0, opponentScore: 0 },
    averageLose: { score: 0, opponentScore: 0 },
    nbrOfFriends: 0,
  };

  const name = params.name;

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

<div class="component">

  <Infos bind:pageUser bind:onlineStatus/>

  <Friends bind:pageUser/>

  <Stats bind:pageUser bind:matchHistory bind:statistics/>

  {#if pageUser.id.toString() === $id}
    <Settings/>
  {/if}

</div>

<style>

  .component {
    height: 100%;
    display: grid;
    place-items: center;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    background-color: var(--black);
  }

  @media screen and (max-width: 1200px) {
    .component {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr 1fr;
      /* grid-template-rows: 125px 1fr 1fr 1fr 1fr; */
    }
  }

</style>
