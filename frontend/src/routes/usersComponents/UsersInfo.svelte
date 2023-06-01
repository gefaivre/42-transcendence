<script lang="ts">
  import axios from "../../axios.config";
  import { id } from "../../stores";
  import deleteIcon from "../../assets/redLose.png";
  import acceptIcon from "../../assets/greenWin.png";
  import type { Match, Stat, User } from "../../types";

  export let pageUser: User;

  export let params;

  const name = params.name;

  let friendspage: String = "Friends";

  let matchHistory: Match[] = [];

  let opponent;

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

  $:{
    pageUser && getMatch()
  }

  async function getMatch() {
    try {
      console.log(pageUser.username)
      const response = await axios.get(`/matchs/history/${pageUser.id}`);
      matchHistory = response.data;
      console.log(matchHistory);
      calculStatistics();
    } catch (e) {
      console.log(e);
    }
  }

  async function calculStatistics() {
    let rankedMatch = matchHistory.filter((match) => match.ranked === true);

    statistics.wonGames = rankedMatch.filter((match) => match.winnerId == pageUser.id).length;
    statistics.lostGames = rankedMatch.filter((match) => match.winnerId != pageUser.id).length;
    statistics.totalGames = rankedMatch.length;
    statistics.ratioGames = +((statistics.wonGames / statistics.totalGames) *100).toFixed(2);
    statistics.averageWin.score = +(rankedMatch.filter((match) => match.winnerId === pageUser.id)
    .reduce((sum, match) => sum + match.winnerScore, 0) /statistics.wonGames).toFixed(2);
    statistics.averageWin.opponentScore = +(rankedMatch.filter((match) => match.winnerId === pageUser.id)
    .reduce((sum, match) => sum + match.loserScore, 0) / statistics.wonGames).toFixed(2);
    statistics.averageLose.score = +(rankedMatch.filter((match) => match.winnerId != pageUser.id)
    .reduce((sum, match) => sum + match.loserScore, 0) /statistics.lostGames).toFixed(2);
    statistics.averageLose.opponentScore = +(rankedMatch.filter((match) => match.winnerId != pageUser.id)
    .reduce((sum, match) => sum + match.winnerScore, 0) /statistics.lostGames).toFixed(2);
    console.log(statistics);
  }

  async function getUsernameById(id: number) {
    try {
      let response = await axios.get(`/users/id/${id}`)
      return response.data.username;
    } catch (e) {
      console.log(e);
    }
  }

  async function acceptFriendshipRequestByName(name: string) {
    try {
      const response = await axios.post(`/users/friendship/acceptByName/${name}`, null);

      //update pageUser
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

  async function removeFriendByName(name: string) {
    try {
      const cancel = await axios.post(`/users/friendship/removeByName/${name}`,null);

      let index = pageUser.friends.findIndex(friend => friend.username === name)
      pageUser.friends.splice(index, 1)

      index = pageUser.friendOf.findIndex(friend => friend.username === name)
      pageUser.friendOf.splice(index, 1)

      pageUser = pageUser

    } catch (e) {
      console.log(e);
    }
  }

  async function unblockByUsername(username: string) {
    try {
      await axios.patch(`/users/unblock/${username}`, null);
      // reload();
    } catch (e) {
      console.log(e);
    }
  }
</script>

<div class="info-container">
  <div class="box-info friends">
    {#if $id === pageUser.id.toString()}
      <div class="nav">
        {#if friendspage == "Friends"}
          <button
            class="activeButton"
            on:click={() => (friendspage = "Friends")}>friends</button
          >
        {:else}
          <button on:click={() => (friendspage = "Friends")}>friends</button>
        {/if}

        {#if friendspage == "Request"}
          <button
            class="activeButton"
            on:click={() => (friendspage = "Request")}>request</button
          >
        {:else}
          <button on:click={() => (friendspage = "Request")}>request</button>
        {/if}

        {#if friendspage == "Pending"}
          <button
            class="activeButton"
            on:click={() => (friendspage = "Pending")}>pending</button
          >
        {:else}
          <button on:click={() => (friendspage = "Pending")}>pending</button>
        {/if}

        {#if friendspage == "Blocked"}
          <button
            class="activeButton"
            on:click={() => (friendspage = "Blocked")}>blocked</button
          >
        {:else}
          <button on:click={() => (friendspage = "Blocked")}>blocked</button>
        {/if}
      </div>
    {:else}
      <h1>Friends</h1>
    {/if}

    {#if friendspage == "Friends"}
      <div class="overflow">
        <ul>
          {#each pageUser.friends as friend}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{friend.id}" alt="pp"/>
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
    {:else if friendspage == "Request" && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.requestFriends as requestFriends}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{requestFriends?.id}" alt="pp"/>
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
    {:else if friendspage == "Pending" && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.pendingFriends as pendingFriends}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{pendingFriends?.id}" alt="pp"/>
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
    {:else if friendspage == "Blocked" && $id === pageUser.id.toString()}
      <div class="overflow">
        <ul>
          {#each pageUser.blocked as blocked}
            <li>
              <div class="user">
                <img class="pp" src="http://localhost:3000/images/actual/{blocked.id}"alt="pp"/>
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

  <div class="box-info games">
    <h1>Game history</h1>
    <div class="overflow">
      <ul>
        {#each matchHistory as match}
          {#if match.winnerId == pageUser.id}
            <li class="lineFriends" id="win">
              <span> <span class="greenDot" /></span>
              <span>{match.winnerScore}</span>
              <span>-</span>
              <span>{match.loserScore}</span>
              <span>
                <img class="pp" src="http://localhost:3000/images/actual/{match.loserId}" alt="pp"/>
              </span>
              <span id="flexStart">
                {#await (opponent = getUsernameById(match.loserId))}
                  ...
                {:then opponent}
                  <a href="#/users/{opponent}">{opponent}</a>
                {/await}
              </span>
              {#if match.ranked}
                <span>R</span>
              {:else}
                <span />
              {/if}
            </li>
          {:else}
            <li class="lineFriends" id="lose">
              <span> <span class="redDot" /></span>
              <span>{match.loserScore} </span>
              <span>-</span>
              <span>{match.winnerScore}</span>
              <span>
                <img class="pp" src="http://localhost:3000/images/actual/{match.winnerId}" alt="pp"/>
              </span>
              <span id="flexStart">
                {#await (opponent = getUsernameById(match.winnerId))}
                  ...
                {:then opponent}
                  <a href="#/users/{opponent}">{opponent}</a>
                {/await}
              </span>
              {#if match.ranked}
                <span>R</span>
              {:else}
                <span />
              {/if}
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  </div>

  <div class="box-info statistics">
    <!--lOST GAME | WON GAME | TOTAL GAMES | GAME RATINO |
    MMR | AVERAGE SCORE WHEN WIN | AVERAGE SCORE WHEN LOSE-->
    <h1>Statistics</h1>
    <div class="stat-grid">
      <div class="tiles">
        <h2>Total games</h2>
        <div class="value">
          <span>{statistics.totalGames}</span>
        </div>
      </div>
      <div class="tiles lite">
        <h2>Won games</h2>
        <div class="value">
          <span>{statistics.wonGames}</span>
        </div>
      </div>
      <div class="tiles lite">
        <h2>Lost games</h2>
        <div class="value">
          <span>{statistics.lostGames}</span>
        </div>
      </div>
      <div class="tiles">
        <h2>Ratio</h2>
        <div class="value">
          <span>{statistics.ratioGames}</span>
        </div>
      </div>
      <div class="tiles">
        <h2>Average win</h2>
        <div class="value">
          <span>{statistics.averageWin.score}-{statistics.averageWin.opponentScore}</span>
        </div>
      </div>
      <div class="tiles lite">
        <h2>Average lose</h2>
        <div class="value">
          <span>{statistics.averageLose.score}-{statistics.averageLose.opponentScore}</span>
        </div>
      </div>
      <div class="chart">
        <span>chart</span>
      </div>
    </div>
  </div>
</div>

<style>
  .info-container {
    height: 100%;
    background-color: var(--grey);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: minmax(0px, 1fr) minmax(0px, 1fr);
    justify-items: center;
    align-items: center;
  }

  .box-info {
    margin: 50px;
    border: solid 2px var(--grey);
    box-shadow: 0 0 10px var(--lite-grey);
    background-color: var(--lite-grey);
    border-radius: 30px;
    height: 80%;
    width: 80%;
    display: flex;
    flex-direction: column;
  }

  .box-info h1 {
    height: 40px;
    border-bottom: solid 1px black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .info-container li {
    height: 40px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    background-color: var(--lite-lite-lite-grey);
  }

  .info-container li:nth-child(2n + 1) {
    background-color: var(--lite-lite-grey);
  }

  .friends .user {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 5%;
  }

  .friends .user .name {
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

  .friends {
    grid-column: 1 / 2;
    grid-row: 1 / 3;
  }

  .friends .nav {
    height: 40px;
    display: flex;
    justify-content: space-around;
  }

  .friends .nav button {
    border-bottom: solid 1px var(--black);
    flex: auto;
  }

  .friends .nav .activeButton {
    border-bottom: none;
  }

  .friends .nav button:not(:last-child) {
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

  .box-info h1 {
    height: 40px;
  }

  .box-info .pp {
    width: 35px;
    height: 35px;
    border: 1px solid rgb(78, 78, 78);
    border-radius: 50%;
  }

  .box-info .overflow {
    flex: 1;
    overflow: auto;
    border-radius: 0 0 30px 30px;
  }

  .games .lineFriends {
    display: grid;
    grid-template-columns: 1fr 0.3fr 0.3fr 0.3fr 1fr 3fr 1fr;
  }

  .games .lineFriends span {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .games .lineFriends #flexStart {
    justify-content: flex-start;
  }

  .games .lineFriends .redDot {
    height: 25px;
    width: 25px;
    background-color: #f93729;
    border-radius: 50%;
    border: solid 1px black;
  }

  .games .lineFriends .greenDot {
    height: 25px;
    width: 25px;
    background-color: #15db36;
    border-radius: 50%;
    border: solid 1px black;
  }

  .stat-grid {
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
  }

  .stat-grid .tiles:last-child {
    border-radius: 0 0 30px 0;
  }

  .stat-grid .lite {
    background-color: var(--lite-lite-grey);
  }

  .stat-grid .tiles {
    position: relative;
  }

  .stat-grid .tiles h2 {
    position: absolute;
    text-align: center;
    color: var(--lite-lite-lite-grey);
  }

  .stat-grid .tiles .value {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .stat-grid .tiles .value span {
    font-size: 3em;
  }

  @media screen and (max-width: 1200px) {
    .info-container {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr, 1fr, 1fr;
    }

    .friends {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    .games {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }

    .statistics {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }
  }

  *::-webkit-scrollbar {
    display: none;
  }

</style>
