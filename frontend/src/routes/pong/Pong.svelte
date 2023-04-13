<script lang="ts">
  import { onMount } from "svelte"
  import  ioClient  from 'socket.io-client';
  import { Ball, Frame, Paddle } from './Objects'

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;

  const frame: Frame =  new Frame(600, 400);
  const ball: Ball =  new Ball(frame); 
  const leftPaddle: Paddle = new Paddle(true, frame); 
  const rightPaddle: Paddle = new Paddle(false, frame); 
  
  let leftScore: number = 0;
  let rightScore: number = 0;
  let stop: boolean = true;

  let inGame: boolean = false;

  const socket = ioClient('http://localhost:3000', {
    path: '/pong',
    withCredentials: true
    });

  onMount(() => {
    ctx = canvas.getContext("2d");
    draw();

    console.log('test');
    socket.on('newPlayer', () => {
      console.log("new player connected");
    });
    
    socket.on('watchGame', () => {
      console.log('watcherMode on');
    });
    
    socket.on('gameState', (state) => {
      inGame = true;
      stop = state.stop;

      leftScore = state.score.leftScore;
      rightScore = state.score.rightScore;

      leftPaddle.posx = state.leftPaddle.posx;
      leftPaddle.posy = state.leftPaddle.posy;

      rightPaddle.posx = state.rightPaddle.posx;
      rightPaddle.posy = state.rightPaddle.posy;

      ball.posx = state.ball.posx;
      ball.posy = state.ball.posy;
    });
    
    game_loop();
    return () => {
      cancelAnimationFrame(animationId);
    };
  });
  
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
  }

  function joinFriendly(event) {
    const formData = new FormData(event.target);

    for (let field of formData) {
      const [key, value] = field;
      if (key === 'friend') {
        socket.emit('requestGame', { friend: value });
      }
    }
  }

</script>

<svelte:body on:keydown={handleKeydown} on:keyup={handleKeyup} />

{#if !inGame}
<button on:click={requestGame}>request random game</button>
<form on:submit|preventDefault={(event) => joinFriendly(event)}>
    <input id="friend" name="friend" type="text" placeholder="type friend username">
    <button type="submit">play a friendly match</button>
</form>
{/if}


{#if inGame}
<p>{leftScore} - {rightScore}</p>
<canvas bind:this={canvas} width={frame.width} height={frame.height}></canvas><br>
{/if}

<style>

canvas {
  border: 1px solid;
}

</style>
