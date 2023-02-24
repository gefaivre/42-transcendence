<script lang="ts">
  import { onMount } from "svelte"

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

  onMount(() => {
    ctx = canvas.getContext("2d");
    draw();

    game_loop();
    return () => {
      cancelAnimationFrame(animationId);
    };
  });

  function start() {
    stop = false;
  }

  function handleKeyup(e) {
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    if (e.key === 'w' || e.key === 's')
      leftPaddle.stop();
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown')
      rightPaddle.stop();
  }

  function handleKeydown(e) {
    if (e.key === 'w' || e.key === 's'
      || e.key === 'ArrowUp' || e.key === 'ArrowDown')
      e.preventDefault()

    if (e.key === 'w')
      leftPaddle.moveUp();
    if (e.key === 's')
      leftPaddle.moveDown();
    if (e.key === 'ArrowUp')
      rightPaddle.moveUp();
    if (e.key === 'ArrowDown')
      rightPaddle.moveDown();
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
      stop = true;
      updateScore();
      ball.reset();
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
