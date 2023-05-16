<script lang="ts">
  import { onMount } from 'svelte';
  import type { GameState } from './Class';
  import { Ball, Frame, Paddle } from './Objects'

  export const update_state = (state: GameState) => {
    leftScore = state.score.leftScore;
    rightScore = state.score.rightScore;

    leftPaddle.posx = state.leftPaddle.posx;
    leftPaddle.posy = state.leftPaddle.posy;

    rightPaddle.posx = state.rightPaddle.posx;
    rightPaddle.posy = state.rightPaddle.posy;

    ball.posx = state.ball.posx;
    ball.posy = state.ball.posy;
  };

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;

  const frame: Frame =  new Frame(600, 400);
  const ball: Ball =  new Ball(frame); 
  const leftPaddle: Paddle = new Paddle(true, frame); 
  const rightPaddle: Paddle = new Paddle(false, frame); 

  let leftScore: number = 0;
  let rightScore: number = 0;
  
  onMount(() => {
    ctx = canvas.getContext("2d");
    
    game_loop();
    return () => {
      cancelAnimationFrame(animationId);
    };
  });

  function game_loop() {
    draw();
    requestAnimationFrame(game_loop);
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

<div id="all">
<p id="score">{leftScore} - {rightScore}</p>
<canvas id="canvas" bind:this={canvas} width={frame.width} height={frame.height}></canvas><br>
</div>

<style>

#score {
  text-align: center;
}

#canvas {
  border: 1px solid black;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
</style>

