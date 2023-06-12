<script lang="ts">
  import axios from "../../../axios.config";
  import type { Match, User } from "../../../types";
  import { handleImageError } from "../../../utils";

  export let pageUser: User;
  export let matchHistory: Match[];

  let opponent: any;

  async function getUsernameById(id: number) {
    try {
      const response = await axios.get(`/users/id/${id}`)
      return response.data.username;
    } catch (e) {
      console.log(e);
    }
  }

</script>

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
                <img class="pp" src="http://localhost:3000/images/actual/{match.loserId}" on:error={handleImageError} alt="pp"/>
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
                <img class="pp" src="http://localhost:3000/images/actual/{match.winnerId}" on:error={handleImageError} alt="pp"/>
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

<style>

.box-info h1 {
    height: 40px;
    border-bottom: solid 1px black;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  li {
    height: 40px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    background-color: var(--lite-lite-lite-grey);
  }

  li:nth-child(2n + 1) {
    background-color: var(--lite-lite-grey);
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

  .games {
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
    background-color: #e30613;
    border-radius: 50%;
    border: solid 1px black;
  }

  .games .lineFriends .greenDot {
    height: 25px;
    width: 25px;
    background-color: #068f3a;
    border-radius: 50%;
    border: solid 1px black;
  }

  *::-webkit-scrollbar {
    display: none;
  }

</style>
