<script lang="ts">
  import axios from "../../axios.config";
  import { id } from "../../stores";
  import type { Match, Stat, User } from "../../types";
  import Friends from "./user-info/Friends.svelte";
  import Settings from "./user-info/Settings.svelte";
  import Stats from "./user-info/Stats.svelte";

  export let pageUser: User;

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
    const rankedMatch = matchHistory.filter((match) => match.ranked === true);

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

</script>

<div class="info-container">
  <Friends bind:pageUser />
  <Stats bind:pageUser bind:matchHistory bind:statistics/>
  {#if pageUser.id.toString() === $id}
    <Settings/>
  {/if}
</div>

<style>

  .info-container {
    height: 100%;
    background-color: var(--grey);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    justify-items: center;
    align-items: center;
  }

  @media screen and (max-width: 1200px) {
    .info-container {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr, 1fr, 1fr;
    }
  }

  *::-webkit-scrollbar {
    display: none;
  }

</style>
