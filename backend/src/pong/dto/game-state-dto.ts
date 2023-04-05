export class Score {
  leftScore: number;
  rightScore: number;
}

export class Item {;
  posx: number;
  posy: number;
}

export class State {
  stop: boolean;
  Score: Score
  leftPaddle: Item;
  rightPaddle: Item;
  ball: Item;
}

export class GameStateDto {
  id: string;
  state: State;
}
