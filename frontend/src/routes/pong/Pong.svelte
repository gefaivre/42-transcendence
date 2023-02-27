<script lang="ts">
  import { onMount } from "svelte"
  import  ioClient  from 'socket.io-client';

  import { Ball, Paddle, Frame } from "./Objects.js";

  let canvas, ctx;
  let animationId;

  const frame: Frame = new Frame(600, 400);

  const leftPaddle: Paddle = new Paddle(true, frame);
  const rightPaddle: Paddle = new Paddle(false, frame);

  const ball: Ball = new Ball(frame);

  let stop: boolean = true;
  let leftScore: number = 0;
  let rightScore: number = 0;

  const socket = ioClient('http://localhost:3000', {path: '/pong'});

  onMount(() => {
    ctx = canvas.getContext("2d");
    draw();

    socket.on('startMessage', () => {
      stop = false;
      socket.emit('initDir');
    });

    socket.on('disconnectMessage', (side: string) => {
      console.log(side + " has disconnected");
    });

    socket.on('controlMessage', (control: {side: string, press: boolean, key: string}) => {
      if (control.press === true) {
        if (control.side === 'left')
          startMove(leftPaddle, control.key);
        else
          startMove(rightPaddle, control.key);
      } else {
        if (control.side === 'left')
          stopMove(leftPaddle, control.key);
        else
          stopMove(rightPaddle, control.key);
      }
    });

    socket.on('dirMessage', (dir: { dirx: number, diry: number }) => {
      ball.initDir(dir);
    });

    game_loop();
    return () => {
      cancelAnimationFrame(animationId);
    };
  });
  
  function start() {
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
    animationId = requestAnimationFrame(game_loop);
    draw();
    leftPaddle.updatePos();
    rightPaddle.updatePos();
    handleCollision();
    if (!stop) {
      ball.updatePos();
    }

    if (ball.posx - ball.radius <= 0 
      || ball.posx + ball.radius >= frame.width) {
      updateScore();
      ball.reset();
      stop = true;
      socket.emit('initDir');
      setTimeout(() => {
        stop = false;
      }, 3000);
      draw();
    }
  }
  
  function updateScore() {
    if (ball.posx - ball.radius <= 0) {
      rightScore += 1;
    } else {
      leftScore += 1;
    }
  }

  function handleCollision() {
    if (checkCollision(rightPaddle)) {
      ball.bouncePaddle(rightPaddle)
    }

    if (checkCollision(leftPaddle)) {
      ball.bouncePaddle(leftPaddle)
    }
  }

  function checkCollision(paddle: Paddle): boolean {
    if (ball.posx + ball.radius < paddle.posx 
      || ball.posx - ball.radius > paddle.posx + paddle.width
      || ball.posy + ball.radius < paddle.posy
      || ball.posy - ball.radius > paddle.posy + paddle.height) {
      return false;
    } else {
      return true;
    }
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
<button on:click|preventDefault={start}> START </button>
{/if}

<style>

canvas {
  border: 1px solid;
}

</style>
