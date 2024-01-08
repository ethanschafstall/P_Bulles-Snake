import '../css/style.css';
import { Snake } from './Snake.js';
import { Segment } from './Segment.js';
import { Apple } from './Apple.js';

// general settings
const CANVAS = document.querySelector('canvas');
const CTX = CANVAS.getContext('2d');
const PIXEL_SIZE = 40;
const REFRESH_RATE = 1000;

// snake starting positions
const SNAKE_START_X = PIXEL_SIZE;
const SNAKE_START_Y = PIXEL_SIZE*4;

// Game border widths/heights
const BOARDER_START = 0;
const BOARDER_LIMIT = 800;

// Apple spawn limits
const APPLE_SPAWN_START = (BOARDER_START/PIXEL_SIZE) + PIXEL_SIZE/PIXEL_SIZE;
const APPLE_SPAWN_LIMIT = (BOARDER_LIMIT/PIXEL_SIZE) - 2 * PIXEL_SIZE/PIXEL_SIZE;

// Gameboard widths/heights
const GAMEBOARD_START = BOARDER_START + PIXEL_SIZE;
const GAMEBOARD_LIMIT = BOARDER_LIMIT - PIXEL_SIZE * 2;


let snake;
let apple;
let score = 0;
let gameStart = true;
let hasPressedSpace;
// listener for
document.addEventListener('keydown', (event) => {
  var code = event.code;
  updateMoveDirection(code);
}, false);

const move = () => {

  // Draw gameboard limits
  CTX.fillStyle = 'DarkRed';
  CTX.fillRect(BOARDER_START, BOARDER_START, BOARDER_LIMIT, BOARDER_LIMIT);

  // Draw gameboard screen
  CTX.fillStyle = 'black';
  CTX.fillRect(GAMEBOARD_START, GAMEBOARD_START, GAMEBOARD_LIMIT, GAMEBOARD_LIMIT);

  // for displaying score.
  CTX.font = `${PIXEL_SIZE}px Geo`;
  CTX.fillStyle = "white";
  CTX.textAlign = "center";
  CTX.fillText(`Score: ${score}`, GAMEBOARD_LIMIT / 2 + 16, GAMEBOARD_START - PIXEL_SIZE / 5);

  // Timer
  setTimeout(() => {
    requestAnimationFrame(move);
  }, REFRESH_RATE);

  
  // Checks if the just started, if true then spawns both the snake and apple.
  gameStart ? (snake = new Snake(SNAKE_START_X , SNAKE_START_Y, 'r'), apple = spawnApple(), gameStart = false): undefined;

  if (hasPressedSpace){
  // Draws the snake
  snake.segments.forEach((e, index, array) => {

    // Check if the index (the snake segment to be drawn) is the last of the array meaning the head of the snake.
    const isHead = index === array.length - 1;

    drawSegment(e.x, e.y, isHead);
  });

  // Create new snake head
  updateSnake();
  // Draw apple
  drawApple();

  // Conditions to check for colisions. If apple colision then spawn new apple, grow snake.
  // If snake colision then alert user of gamestate, reload game.
  checkAppleColision() ? (apple = spawnApple(), createSegment(), score++) : undefined;
  checkSnakeColision() ? (alert("You lost!"), location.reload()) : undefined;
  hasPressedSpace = false;
}
};

requestAnimationFrame(move);

// Function for drawing a snake segment
const drawSegment = (x, y, altColor) => {
  altColor ?  CTX.fillStyle = 'orange' : CTX.fillStyle = 'red'
  CTX.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
}

// Function for creating a new snake segment
const createSegment = () => {

  // Creates a new segment with the same position values as the first segement in the array (the snake's tail)
  const { x, y } = snake.segments[0];
  snake.segments.unshift(new Segment(x, y));
}

// Function which updates the whole snake (head and tail) by pushing a new segment, based on move direction to the end of the segment array
// and shifts (removes) first segment of the segment array.
const updateSnake = () => {
  
  let { x, y } = snake.segments[snake.segments.length - 1];

  // Checks the direction in which the snake is moving and modifies the axis affected.
  switch (snake.direction) {
    case 'u':
      y -= PIXEL_SIZE;
      break;
    case 'd':
      y += PIXEL_SIZE;
      break;
    case 'l':
      x -= PIXEL_SIZE;
      break;
    case 'r':
      x += PIXEL_SIZE;
      break;
  }
  // adds said new segment (head) to the array.
  snake.segments.push(new Segment(x, y));
  // removes first segment (tail) from the array.
  snake.segments.shift();
}

// Function which updates the snake move direction.
const updateMoveDirection = (keyPressed) => {
 
  let index = snake.segments.length-1;

  switch (keyPressed) {
    case "KeyW":
      // checks if the head and segment right behind it aren't already on the same axis, if so then it can't travel in that direction.
      if (snake.segments[index-1].x != snake.segments[index].x) {
        snake.direction = 'u';
      }
      break;
    case "KeyS":
      if (snake.segments[index-1].x != snake.segments[index].x) {
        snake.direction = 'd';
      }
      break;
    case "KeyA":
      if (snake.segments[index-1].y != snake.segments[index].y) {
        snake.direction = 'l';
      }
      break;
    case "KeyD":
      if (snake.segments[index-1].y != snake.segments[index].y) {
        snake.direction = 'r';
      }
      break;  
    case "Space":
      hasPressedSpace = true;
      break;
  }
}

// Function that returns an apple object which x & y positions that aren't equal to any of the snake segments x & y pos.
const spawnApple = () => {
  
  let appleXPos;
  let appleYPos;
  
  let randomXNum;
  let randomYNum;

  let xNums = snake.segments.map(a => a.x);
  let yNums = snake.segments.map(a => a.y);
  

  // Generates random numbers between 1-18 (gameboard limits), while the numbers don't equate to any of the segment x & y values
  do {
    randomXNum = Math.floor(Math.random() * APPLE_SPAWN_LIMIT)+ APPLE_SPAWN_START;
    randomYNum = Math.floor(Math.random() * APPLE_SPAWN_LIMIT)+ APPLE_SPAWN_START;
    } while (xNums.includes(randomXNum) && yNums.includes(randomYNum));
  
    // apples x and y positions between the randomly generated values, multiplied by pixelsize so 
  appleXPos = randomXNum*PIXEL_SIZE;
  appleYPos = randomYNum*PIXEL_SIZE;

  return new Apple(appleXPos, appleYPos);

}
// Function which draws apple using it's x and y cords.
const drawApple = () => {
  
  CTX.fillStyle = 'green';
  CTX.fillRect(apple.x, apple.y, PIXEL_SIZE, PIXEL_SIZE);

}
// Function which which returns a conditional variable if the apple and snake head are overlapping.
const checkAppleColision = () => {

  const head = snake.segments[snake.segments.length-1];

  // Check if the apple and snake head are overlapping.
  return apple.x == head.x && apple.y == head.y ? true : false;
}

// Function which checks for the snakes colisions, returns a true boolean if the snake is colliding something it shouldn't.
const checkSnakeColision = () => {

  const head = snake.segments[snake.segments.length - 1];
  // condition for if the snake is out of gameboard bounderies.
  const isOutOfBounds = head.y < GAMEBOARD_START || head.y > GAMEBOARD_LIMIT || head.x < GAMEBOARD_START || head.x > GAMEBOARD_LIMIT;
  // condition for if snake is overlapping with itself.
  const isBodyOverlap = snake.segments.slice(0, snake.segments.length - 1).some(element => element.x === head.x && element.y === head.y);
 
  return isOutOfBounds || isBodyOverlap;
}
