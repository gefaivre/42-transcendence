<script lang="ts">
  import { onMount } from "svelte"
  import  ioClient  from 'socket.io-client';
  import axios  from "axios";
  import Game from "./Game.svelte";
  import type { GameState } from "./Class";

  class Match { 
    player1: string;
    player2: string;
  }

  let gameList: Match[] = [];

  let currentMatch: Match = { player1: '', player2: '' }

  let update_child: (state: GameState) => void;

  let unique = {} //use to restart Game component

  let inGame: boolean = false;
  let gameRequest: boolean = false;
  let watch = false;

  const socket = ioClient('http://localhost:3000', {
    path: '/pong',
    withCredentials: true
    });

  onMount(() => {
    socket.on('gameStart', (match) => {
      currentMatch = match;
      console.log("game started");
    });
    
    socket.on('watchGame', () => {
      watch = true;
      console.log('watcherMode on');
    });

    socket.on('win', () => {
      alert('you win! refresh page to play another game');
      restart();
      inGame = false;
    });
    
    socket.on('lose', () => {
      alert('you lose! refresh page to play another game');
      restart();
      inGame = false;
    });

    socket.on('opponentLeft', () => {
      if (watch)
        alert('A player has left the game. Refresh page to watch another game');
      else
        alert('your opponent has left the game, you win! refresh page to play another game');
      restart();
      inGame = false;
    });

    socket.on('gameState', (state) => {
      inGame = true;
      update(state);
      gameRequest = false;
      if (state.stop)
        inGame = false
    });
  });

  function update(state: GameState) {
    update_child(state);
  }

  function restart() { 
    unique = {};
  }

  getGames();
  console.log('gameList', gameList);

  async function getGames() {
    let games = (await axios.get('/pong')).data;
    for (const game of games) {
      gameList.push(game);
    }
    gameList = gameList;
  }
  
  function handleKeyup(e: KeyboardEvent) {
    if (!inGame)
      return ;
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: false, key: e.key });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!inGame)
      return ;
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: true, key: e.key });
  }
  

  function requestGame() {
    socket.emit('requestGame', {});
    gameRequest = true;
  }

  function joinFriendly(event: any) {
    const formData = new FormData(event.target);

    for (let field of formData) {
      const [key, value] = field;
      if (key === 'friend' && value) {
        socket.emit('requestGame', { friend: value });
      }
    }
  }

  function watchGame(game: string) {
    socket.emit('watchGame', {gameName: game});
  }

</script>

<svelte:body on:keydown={handleKeydown} on:keyup={handleKeyup} />

<div id="all">

{#if !inGame}

<h2 id="title"> Pong </h2>

{#if gameList}
  <ul>
    {#each gameList as game}
      <li>{game.player1 + ' vs ' + game.player2} game</li>
      <button on:click={() => watchGame(game.player1)}>watch</button>
    {/each}
  </ul>
{/if}


  {#if !gameRequest}
  <div id="randomGame">
  <button on:click={requestGame}>request random game</button>
  </div>

  <div id="friendlyGame">
  <form on:submit|preventDefault={(event) => joinFriendly(event)}>
      <input id="friend" name="friend" type="text" placeholder="type friend username">
      <button type="submit">play a friendly match</button>
  </form>
  </div>
  {/if}
{/if}

{#if inGame}
{#key unique}
<Game bind:players={currentMatch} bind:update_state={update_child}></Game>
{/key}
{/if}

{#if gameRequest}
<h2>Game requested !</h2>
{/if}

</div>

<style>

#all {
  color: var(--white);
  height: 100vh;
  background-color: var(--grey);
  border-left: 1px solid grey;
  text-align: center;
}

#title {
  color: rgb(158, 39, 217);
  font-size: 2em;
  font-weight: bold;
  margin-bottom:2em;
}

#randomGame {
  margin-bottom: 2em;
}

button {
  background-color:#3b82f6;
  font-weight: bold;
  border: 1px solid #1d4ed8;
  border-radius:4px;
  padding:0.5em;
}
button:hover {
  background-color:#1d4ed8
}

input {
  border-radius: 2px;
  padding:0.2em;
  margin:0.5em;
  color: black;
}
</style>
