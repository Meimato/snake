const canvasWidth = 600;
const canvasHeight = 300;
const blockSize = 30;
const snakeColor = "#1F5";
const appleColor = "#C22";
let delay = 100;
let ctx;
let snake;
let apple;

window.onload = function () {
  init();
  snake = new Snake(
    [
      [9, 2],
      [8, 2],
      [7, 2],
    ],
    "right"
  );
  apple = new Apple([5, 5]);
  drawGame();
};

function init() {
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  canvas.style.border = "1px solid black";

  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");
}

function drawGame() {
  snake.move();
  if (snake.checkDeath()) {
    restartGame();
  } else {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    snake.draw();
    apple.draw();
  }
  setTimeout(drawGame, delay);
}

function restartGame() {
  snake = new Snake(
    [
      [9, 2],
      [8, 2],
      [7, 2],
    ],
    "right"
  );
  apple.createApple();
}

function Apple(coordinates) {
  this.coordinates = coordinates;

  this.draw = function () {
    ctx.fillStyle = appleColor;
    ctx.fillRect(
      this.coordinates[0] * blockSize,
      this.coordinates[1] * blockSize,
      blockSize,
      blockSize
    );
  };

  this.isEaten = function () {
    if (
      snake.body[0][0] == this.coordinates[0] &&
      snake.body[0][1] == this.coordinates[1]
    ) {
      return true;
    } else {
      return false;
    }
  };

  this.createApple = function () {
    this.coordinates[0] = Math.floor(
      Math.random() * (canvasWidth / blockSize)
    );
    this.coordinates[1] = Math.floor(
      Math.random() * (canvasHeight / blockSize)
    );

    for (let index = 0; index < snake.body.length; index++) {
      const element = snake.body[index];
      if (this.coordinates[0] == element[0] && this.coordinates[1] == element[1]) {
        this.createApple();
      }
    }
  };
}

function Snake(body, direction) {
  this.body = body;
  this.direction = direction;

  this.draw = function () {
    ctx.fillStyle = snakeColor;
    for (let i = 0; i < this.body.length; i++) {
      ctx.fillRect(
        this.body[i][0] * blockSize,
        this.body[i][1] * blockSize,
        blockSize,
        blockSize
      );
    }
  };

  this.move = function () {
    let newPos = this.body[0];
    switch (this.direction) {
      case "right":
        if (newPos[0] + 1 > canvasWidth / blockSize - 1) {
          this.body.unshift([0, newPos[1]]);
        } else {
          this.body.unshift([newPos[0] + 1, newPos[1]]);
        }
        break;
      case "left":
        if (newPos[0] - 1 < 0) {
          this.body.unshift([canvasWidth / blockSize - 1, newPos[1]]);
        } else {
          this.body.unshift([newPos[0] - 1, newPos[1]]);
        }
        break;
      case "down":
        if (newPos[1] + 1 > canvasHeight / blockSize - 1) {
          this.body.unshift([newPos[0], 0]);
        } else {
          this.body.unshift([newPos[0], newPos[1] + 1]);
        }
        break;
      case "up":
        if (newPos[1] - 1 < 0) {
          this.body.unshift([newPos[0], canvasHeight / blockSize - 1]);
        } else {
          this.body.unshift([newPos[0], newPos[1] - 1]);
        }
        break;
      default:
        break;
    }
    if (apple.isEaten()) {
      apple.createApple();
    } else {
      this.body.pop();
    }
    this.checkDeath();
  };

  this.changeDirection = function (direction) {
    let allowedDirections = [];
    switch (this.direction) {
      case "right":
      case "left":
        allowedDirections = ["up", "down"];
        break;
      case "up":
      case "down":
        allowedDirections = ["right", "left"];
        break;
      default:
        throw "Invalid direction";
    }
    if (allowedDirections.indexOf(direction) > -1) {
      this.direction = direction;
    }
  };

  this.checkDeath = function () {
    let snakeHead = this.body[0];
    let snakeBody = this.body.slice(1);
    for (let index = 0; index < snakeBody.length; index++) {
      const element = snakeBody[index];
      if (element[0] == snakeHead[0] && element[1] == snakeHead[1]) {
        return true;
      }
    }
    return false;
  };
}

document.onkeydown = function (e) {
  let newDirection;
  switch (e.key) {
    case "ArrowRight":
      newDirection = "right";
      break;
    case "ArrowDown":
      newDirection = "down";
      break;
    case "ArrowLeft":
      newDirection = "left";
      break;
    case "ArrowUp":
      newDirection = "up";
      break;
    case " ":
        restartGame();
        break;
    default:
      return;
  }
  snake.changeDirection(newDirection);
};
