  const BALL_SPEED: number = 3.5;
  const PADDLE_SPEED: number = 5;

  export class Frame {
    width: number;
    height: number;

    constructor(w: number, h:number) {
      this.width = w;
      this.height = h;
    }

  };

  export class Ball {
    frame: Frame;
    posx: number;
    posy: number;
    dirx: number;
    diry: number;
    speed: number;
    radius: number;
    lastCollision: Paddle;

    constructor(frame: Frame) {
      this.frame = frame;
      this.speed = BALL_SPEED;
      this.posx = frame.width / 2;
      this.posy = frame.height / 2 ;
      this.diry = 0;
      this.dirx = 0;
      this.radius = frame.width / 50;
      this.lastCollision = null;
    }

    reset() {
      this.posx = this.frame.width / 2;
      this.posy = this.frame.height / 2;
      this.diry = 0;
      this.dirx = 0;
      this.speed = BALL_SPEED
      this.lastCollision = null;
    }

    initDir(dir: {dirx: number, diry: number}) {
      this.dirx = dir.dirx; 
      this.diry = dir.diry;
    }

    updatePos() {
      this.posx = this.posx + this.dirx * this.speed;
      this.posy = this.posy + this.diry * this.speed;

      if (this.posy - this.radius <= 0 || 
          this.posy + this.radius >= this.frame.height)
        this.diry = -this.diry;
    }

    bouncePaddle(paddle: Paddle) {
      if (this.lastCollision && this.lastCollision === paddle)
        return ;
      this.lastCollision = paddle;

      let yPaddle: number = this.posy - (paddle.posy + (paddle.height / 2));

      let newAngle: number = Math.asin(yPaddle / paddle.height);
      this.diry = Math.sin(newAngle);
      if (this.dirx < 0)
        this.dirx = Math.cos(newAngle);
      else
        this.dirx = -Math.cos(newAngle);
      this.speed = this.speed + BALL_SPEED / 10;
    }
  };

  export class Paddle {
    left: boolean;
    frame: Frame;
    posx: number;
    posy: number;
    dy: number;
    height: number;
    width: number;
    speed: number;

    constructor(left: boolean, frame: Frame) {
      this.left = left
      this.frame = frame;
      this.height = frame.height / 5;
      this.width = frame.width / 50;
      this.speed = PADDLE_SPEED;

      if (left) {
        this.posx = 0.01 * frame.width;
      } else {
        this.posx = frame.width - this.width - 0.01 * frame.width;
      }
      this.posy = frame.height / 2 - this.height / 2;
    }

    moveUp() {
      this.dy = -1;
    }

    moveDown() {
      this.dy = 1;
    }

    stop() {
      this.dy = 0;
    }

    updatePos() {
      if (this.posy + this.dy * this.speed>= 0
          && this.posy + this.height + this.dy * this.speed <= this.frame.height) {
        this.posy = this.posy + this.dy * this.speed;
      }
    }
  };
