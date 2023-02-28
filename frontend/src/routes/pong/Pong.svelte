<script lang="ts">
  import { onMount } from "svelte"
  import  ioClient  from 'socket.io-client';
  import { Ball, Frame, Paddle } from './Objects'

  let canvas, ctx;
  let animationId;

  const frame: Frame =  new Frame(600, 400);
  const ball: Ball =  new Ball(frame); 
  const leftPaddle: Paddle = new Paddle(true, frame); 
  const rightPaddle: Paddle = new Paddle(false, frame); 
  
  let leftScore: number = 0;
  let rightScore: number = 0;
  let start: boolean = false;

  const socket = ioClient('http://localhost:3000', {path: '/pong'});

  onMount(() => {
    ctx = canvas.getContext("2d");
    draw();

    socket.on('disconnectMessage', (side: string) => {
      console.log(side + " has disconnected");
    });
    
    socket.on('startMessage', () => {
      console.log("start Message received");
      game_loop();
    });

    socket.on('gameStateMessage', (state) => {
      start = state.start;

      leftScore = state.score.leftScore;
      rightScore = state.score.rightScore;
      console.log(leftScore," ", rightScore);

      leftPaddle.posx = state.leftPaddle.posx;
      leftPaddle.posy = state.leftPaddle.posy;
      leftPaddle.width = state.leftPaddle.width;
      leftPaddle.height = state.leftPaddle.height;

      rightPaddle.posx = state.rightPaddle.posx;
      rightPaddle.posy = state.rightPaddle.posy;
      rightPaddle.width = state.rightPaddle.width;
      rightPaddle.height = state.rightPaddle.height;

      ball.posx = state.ball.posx;
      ball.posy = state.ball.posy;
      ball.radius = state.ball.radius;
    });

    return () => {
      cancelAnimationFrame(animationId);
    };
  });
  
  function startGame() {
    socket.emit('start', {});
  }

  function handleKeyup(e: KeyboardEvent) {
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: false, key: e.key });
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    socket.emit('control', { press: true, key: e.key });
  }
  
  function startMove(paddle: Paddle, key: string) {
    if (key === 'w' || key === 'ArrowUp')
      paddle.moveUp();
    if (key === 's' || key === 'ArrowDown')
      paddle.moveDown();
  }

  function stopMove(paddle: Paddle, key: string) {
    if (key === 'w' || key === 's' || key === 'ArrowUp' || key === 'ArrowDown')
      paddle.stop();
  }

  function game_loop() {
    setTimeout(1 / 60);
    animationId = requestAnimationFrame(game_loop);
    socket.emit('getState');
    draw();
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

</script>

<svelte:body on:keydown={handleKeydown} on:keyup={handleKeyup} />

<p>{leftScore} - {rightScore}</p>
<canvas bind:this={canvas} width={frame.width} height={frame.height}></canvas><br>
{#if stop}
<button on:click|preventDefault={startGame}> START </button>
{/if}

<style>

canvas {
  border: 1px solid;
}

</style>
