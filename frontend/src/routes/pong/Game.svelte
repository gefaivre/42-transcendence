<script lang="ts">
  import { onMount } from 'svelte';
  import type { GameState } from './Class';
  import { Ball, Frame, Paddle } from './Objects'
  import { fade } from 'svelte/transition';

  export const update_state = (state: GameState) => {
    leftScore = state.score.leftScore;
    rightScore = state.score.rightScore;

    leftPaddle.posx = state.leftPaddle.posx;
    leftPaddle.posy = state.leftPaddle.posy;

    rightPaddle.posx = state.rightPaddle.posx;
    rightPaddle.posy = state.rightPaddle.posy;

    ball.posx = state.ball.posx;
    ball.posy = state.ball.posy;
    
    if (state.countdown === 0)
      countdown = 0;
    else if (state.countdown <= 100)
      countdown = 1;
    else if (state.countdown <= 200)
      countdown = 2;
    else
      countdown = 3;
  };

  export let players = {player1: '', player2: ''};

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let animationId: number;

  let countdown: number = 3;

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
    ctx.fillStyle = 'rgb(158, 39, 217)';
    ctx.fillRect(leftPaddle.posx, leftPaddle.posy,
      leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.posx, rightPaddle.posy,
      rightPaddle.width, rightPaddle.height);
  }
  
  function drawBall() {
    ctx.fillStyle = 'rgb(255, 88, 171)';
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
<p id="score">{leftScore}  -  {rightScore}</p>
<div id="game">
  <canvas id="canvas" bind:this={canvas} width={frame.width} height={frame.height}></canvas><br>
  {#if countdown != 0}
  <p transition:fade id="countdown">{countdown}</p>
  {/if}
</div>
<p id="players">{players.player1}  VS  {players.player2}</p>
</div>

<style>

#all {
  background-color: var(--grey);
  padding: 1em;
}

#score {
  text-align: center;
  font-weight: bold;
  color:var(--pink);
  margin-bottom: 1em;
}

#players {
  text-align: center;
  font-weight: bold;
  color:#3b82f6;
  margin-bottom: 1em;
}

#game {
  min-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: auto;
  margin-top: auto;
}

#canvas {
  margin-left: auto;
  margin-right: auto;
  border: 1px solid grey;
}

#countdown {
  position: absolute;
  margin-left:0.5em;
  left: 50%;
  top:200px;

  font-size: 4em;
  font-weight: bold;
  color: var(--lite-lite-lite-grey);

}
</style>

