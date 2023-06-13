<script lang="ts">
  import { onMount } from "svelte"
  import  ioClient  from 'socket.io-client';
  import axios  from "axios";
  import Game from "./Game.svelte";
  import type { GameState, Settings } from "./Class";
  import type { WsException } from "../../types";
  import { Status } from "../../types";
  import { socket as _socket } from "../../stores"
  import { toast } from '@zerodevx/svelte-toast/dist'
  import { querystring } from "svelte-spa-router";

  class Match {
    player1: string;
    player2: string;
  }

  let settings: Settings = { ballSize: 1, ballSpeed: 1, paddleSize: 1, paddleSpeed: 1 };

  let gameList: Match[] = [];

  let currentMatch: Match = { player1: '', player2: '' }

  let update_child: (state: GameState) => void;

  let unique = {} //used to restart Game component

  let friendly = false;
  let friendUsername = '';

  let inGame: boolean = false;
  let gameRequest: boolean = false;
  let watch = false;

  const socket = ioClient('http://localhost:3000', {
    path: '/pong',
    withCredentials: true
  });

  onMount(() => {

    const searchParams = new URLSearchParams($querystring)
    if (searchParams.has('player2') === true) {
      friendly = true
      friendUsername = searchParams.get('player2')
    }

    socket.on('gameStart', (match) => {
      currentMatch = match;
      console.log("game started");
      $_socket.emit('setOnlineStatus', Status.offline)
    });

    socket.on('watchGame', (res) => {
      if (res.response === true) {
        currentMatch = res.players;
        settings = res.settings;
        console.log(res);
        watch = true;
        console.log('watcherMode on');
      } else {
        alert('This match is no longer played, refresh the page');
      }
    });

    socket.on('win', () => {
      restart();
      toast.push('you win!', { classes: ['success'] });
      inGame = false;
    });

    socket.on('lose', () => {
      restart();
      toast.push('you lose!', { classes: ['failure'] })
      inGame = false;
    });

    socket.on('endWatch', (player) => {
      if (watch) {
        restart();
        toast.push(player.username + ' has won the game');
        watch = false;
      }
    });

    socket.on('opponentLeft', (player) => {
      restart();
      if (watch)
        toast.push(player.username + ' has left the game');
      else
        toast.push(player.username + ' has left the game, you win!');
      inGame = false;
    });

    socket.on('gameState', (state) => {
      inGame = true;
      update(state);
      gameRequest = false;
      if (state.stop)
        inGame = false
    });

    socket.on('exception', (e: WsException) => {
      alert(e.message)
    })

    socket.on('alreadyRequested', () => {
      toast.push('Game already requested!');
      gameRequest = false;
    });

    return ()=> {
      socket.close();
    };
  });

  function update(state: GameState) {
    update_child(state);
  }

  function restart() {
    unique = {};
    gameList = [];
    getGames();
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
    if (inGame === false)
      return ;
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: false, key: e.key });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (inGame === false)
      return ;
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: true, key: e.key });
  }

  function requestGame() {
    console.log('settings', settings);
    if (friendly) {
      socket.emit('requestGame', { friend: friendUsername, settings: settings });
    } else {
      socket.emit('requestGame', { settings: settings });
    }

    gameRequest = true;
  }

  function cancelRequest() {
    socket.emit('cancelRequest', {});
    gameRequest = false;
  }

  function watchGame(game: string) {
    socket.emit('watchGame', {gameName: game});
  }

</script>

<svelte:body on:keydown={handleKeydown} on:keyup={handleKeyup} />

<div id="all">

{#if !inGame}

<h1 id="title"> Pong </h1>

<div id="body">


  {#if !gameRequest}
  <div id="requestGame">
    <h2>Play game</h2>
    <input id="checkbox" type="checkbox" name="friendly" bind:checked={friendly}><label for="friendly">play friendly game</label>
    {#if friendly}
    <input bind:value={friendUsername} type="text" placeholder="your friend username">

    <h3>Settings</h3>
    <table id="settingsTable">

    <tr>
    <td align="left"><label for="ballSpeed">ball speed</label></td>
    <td align="right"><input name="ballSpeed" bind:value={settings.ballSpeed} type="number" min="0.5" max="3" step="0.1"></td>
    </tr>

    <tr>
    <td align="left"><label for="ballSize">ball size</label></td>
    <td align="right"><input name="ballSize" bind:value={settings.ballSize} type="number" min="0.5" max="2" step="0.1"></td>
    </tr>

    <tr>
    <td align="left"><label for="paddleSpeed">paddle speed</label></td>
    <td align="right"><input name="paddleSpeed" bind:value={settings.paddleSpeed} type="number" min="0.5" max="2" step="0.1"></td>
    </tr>

    <tr>
    <td align="left"><label for="paddleSize">paddle size</label></td>
    <td align="right"><input name="paddleSize" bind:value={settings.paddleSize} type="number" min="0.5" max="2" step="0.1"></td>
    </tr>
    </table>
    {/if}


  <br>
  {#if friendly}
  <button id="requestButton" on:click={requestGame}>request friendly game</button>
  {:else}
  <button id="requestButton" on:click={requestGame}>request random game</button>
  {/if}


  </div>

 <div id="watchGame">
 <h2>Watch Game</h2>
 {#if gameList.length}
  <ul id="gameList">
    {#each gameList as game}
      <li>{game.player1 + ' vs ' + game.player2} <button id="watchButton" on:click={() => watchGame(game.player1)}>watch</button></li>
    {/each}
  </ul>
{:else}
  <p>No games to watch at the moment !</p>
{/if}
</div>

 {/if}

</div>
{/if}

{#if inGame}
{#key unique}
<Game bind:gameSettings={settings} bind:players={currentMatch} bind:update_state={update_child}></Game>
{/key}
{/if}

{#if gameRequest}
<h3>Game requested ! Waiting for your opponent ...</h3>
<button on:click={cancelRequest}>Cancel</button>
{/if}

</div>


<style>

#all {
  font-weight: bold;
  display: flex;
  flex-direction: column;
  color: var(--white);
  background-color: var(--grey);
  border-left: 1px solid grey;
  padding-bottom: 2em;
  text-align: center;
}

#body {
  display:flex;
  align-content: center;
}

#title {
  color: rgb(158, 39, 217);
  font-size: 2em;
  font-weight: bold;
  margin-bottom:2em;
}

#watchGame {
  flex-grow: 1;
}

#requestGame {
  flex-grow: 1;
}

#settingsTable {
  margin-top:1em;
  margin-left:auto;
  margin-right:auto;
}

#checkbox {
  margin-left:0;
}

h2 {
  font-size:1.3em;
  color:var(--pink);
  margin-bottom:1em;
}

h3 {
  font-size:1.1em;
  color: rgb(158, 39, 217);
  margin-top:1.2em;
}

button {
  background-color:#3b82f6;
  font-weight: bold;
  border: 1px solid #1d4ed8;
  border-radius:4px;
  padding:0.5em;
  margin: 1em;
  color: var(--white);
}

button:hover {
  background-color:#1d4ed8
}

input {
  border-radius: 2px;
  font-weight:normal;
  padding:0.5em;
  margin:0.5em;
  color: black;
}

</style>
