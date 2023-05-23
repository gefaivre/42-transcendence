export class GameState {

    stop: boolean;

    score: {
      leftScore: number;
      rightScore: number;
    };

    leftPaddle: {
      posx: number;
      posy: number;
    };

    rightPaddle: {
      posx: number;
      posy: number;
    };

    ball: {
      posx: number;
      posy: number;
    };
    
    countdown: number;
  }
