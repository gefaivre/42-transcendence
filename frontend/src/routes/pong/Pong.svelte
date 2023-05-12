<script lang="ts">
  import { onMount } from "svelte"
  import  ioClient  from 'socket.io-client';
  import { Ball, Frame, Paddle } from './Objects'
  import axios  from "axios";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;

  const frame: Frame =  new Frame(600, 400);
  const ball: Ball =  new Ball(frame); 
  const leftPaddle: Paddle = new Paddle(true, frame); 
  const rightPaddle: Paddle = new Paddle(false, frame); 
  

  class Game { 
    id: string;
    player1: string;
    player2: string;
  }

  let gameList: Game[] = [];

  let leftScore: number = 0;
  let rightScore: number = 0;
  let stop: boolean = true;

  let inGame: boolean = false;
  let gameRequest: boolean = false;
  let watch = false;

  const socket = ioClient('http://localhost:3000', {
    path: '/pong',
    withCredentials: true
    });

  onMount(() => {
    ctx = canvas.getContext("2d");

    socket.on('newPlayer', () => {
      console.log("new player connected");
    });
    
    socket.on('watchGame', () => {
      watch = true;
      console.log('watcherMode on');
    });

    socket.on('win', () => {
      alert('you win! refresh page to play another game');
    });
    
    socket.on('lose', () => {
      alert('you lose! refresh page to play another game');
    });

    socket.on('opponentLeft', () => {
      if (watch)
        alert('A player has left the game. Refresh page to watch another game');
      alert('your opponent has left the game, you win! refresh page to play another game');
    });

    socket.on('gameState', (state) => {
      if (!inGame)
        game_loop();
      inGame = true;
      gameRequest = false;
      stop = state.stop;
      if (stop)
        inGame = false

      leftScore = state.score.leftScore;
      rightScore = state.score.rightScore;

      leftPaddle.posx = state.leftPaddle.posx;
      leftPaddle.posy = state.leftPaddle.posy;

      rightPaddle.posx = state.rightPaddle.posx;
      rightPaddle.posy = state.rightPaddle.posy;

      ball.posx = state.ball.posx;
      ball.posy = state.ball.posy;
    });
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  });

  getGames();
  console.log('gameList', gameList);

  async function getGames() {
    let games = (await axios.get('http://localhost:3000/pong', {withCredentials: true})).data;
    for (const game of games) {
      gameList.push(game);
    }
    gameList = gameList;
  }
    
  
  function game_loop() {
    requestAnimationFrame(game_loop);
    draw();
  }

  function handleKeyup(e: KeyboardEvent) {
    if (stop) 
      return ;
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: false, key: e.key });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (stop) 
      return ;
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: true, key: e.key });
  }
  
  function drawPaddles() {
    ctx.fillStyle = "green";
    ctx.fillRect(leftPaddle.posx, leftPaddle.posy,
      leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.posx, rightPaddle.posy,
      rightPaddle.width, rightPaddle.height);
  }
  
  function drawBall() {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.posx, ball.posy, ball.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, frame.width, frame.height);
    drawPaddles();
    drawBall();
  };

  function requestGame() {
    socket.emit('requestGame', {});
    gameRequest = true;
  }

  function joinFriendly(event: any) {
    const formData = new FormData(event.target);

    for (let field of formData) {
      const [key, value] = field;
      if (key === 'friend') {
        socket.emit('requestGame', { friend: value });
      }
    }
  }

  function watchGame(game: string) {
    socket.emit('watchGame', {gameName: game});
  }

</script>

<svelte:body on:keydown={handleKeydown} on:keyup={handleKeyup} />

{#if !inGame}

{#if gameList}
  <ul>
    {#each gameList as game}
      <li>{game.player1 + ' vs ' + game.player2} game</li>
      <button on:click={() => watchGame(game.player1)}>watch</button>
    {/each}
  </ul>
{/if}


  {#if !gameRequest}
  <button on:click={requestGame}>request random game</button>
  <form on:submit|preventDefault={(event) => joinFriendly(event)}>
      <input id="friend" name="friend" type="text" placeholder="type friend username">
      <button type="submit">play a friendly match</button>
  </form>
  {/if}
{/if}

{#if inGame}
<p>{leftScore} - {rightScore}</p>
{/if}

<div class:inGame={inGame}>
<canvas bind:this={canvas} width={frame.width} height={frame.height}></canvas><br>
</div>

{#if gameRequest}
<h2>Game requested !</h2>
{/if}

<style>

.inGame {
  border: 1px solid;
  display: inline-block;
}

</style>
