import '../css/style.css';
import { Snake } from './Snake.js';
import { Segment } from './Segment.js';
import { Apple } from './Apple.js';

// general settings
const CANVAS = document.querySelector('canvas');
const CTX = CANVAS.getContext('2d');
const PIXEL_SIZE = 40;
const REFRESH_RATE = 100;

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


let snake = new Snake(SNAKE_START_X , SNAKE_START_Y, 'r');
let apple;
let gameOver = false;
let score = 0;
let gameStart = true;

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

  CTX.font = `${PIXEL_SIZE}px Geo`;
  CTX.fillStyle = "white";
  CTX.textAlign = "center";
  CTX.fillText(`Score: ${score}`, GAMEBOARD_LIMIT / 2 + 16, GAMEBOARD_START - PIXEL_SIZE / 5);

  // Timer
  setTimeout(() => {
    requestAnimationFrame(move);
  }, REFRESH_RATE);

  const head = snake.segments[snake.segments.length-1];
  
  //
  gameStart ? (apple = spawnApple(), gameStart = false): undefined;

  // Draw snake
  snake.segments.forEach(e => drawSegment(e.x, e.y));
  // Create new snake head
  updateSnake();
  // Draw apple
  drawApple();

  checkAppleColision() ? (apple = spawnApple(), createSegment(), score++) : undefined;

  checkSnakeColision() ? location.reload() : undefined;
};

requestAnimationFrame(move);

// Function for drawing a snake segment
function drawSegment(x, y){
    CTX.fillStyle = 'red';
    CTX.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
}

// Function for creating a new snake segment
function createSegment() {
  const { x, y } = snake.segments[0];
  snake.segments.unshift(new Segment(x, y));
}

// Function which updates the whole snake (head and tail) by pushing a new segment, based on move direction to the end of the segment array.
// and shifts(removes) first segment of the segment array.
function updateSnake() {
  const { x, y } = snake.segments[snake.segments.length - 1];
  let newX, newY;
  switch (snake.direction) {
    case 'u':
      newX = x;
      newY = y - PIXEL_SIZE;
      break;
    case 'd':
      newX = x;
      newY = y + PIXEL_SIZE;
      break;
    case 'l':
      newX = x - PIXEL_SIZE;
      newY = y;
      break;
    case 'r':
      newX = x + PIXEL_SIZE;
      newY = y;
      break;
  }
  snake.segments.push(new Segment(newX, newY));
  snake.segments.shift();
}

// Function which updates the snake move direction
function updateMoveDirection(keyPressed){
 
  let index = snake.segments.length-1;

  switch (keyPressed) {
    case "KeyW":
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
    case "ArrowUp":
      if (snake.segments[index-1].x != snake.segments[index].x) {
        snake.direction = 'u';
      }
      break;
      case "ArrowDown":
        if (snake.segments[index-1].x != snake.segments[index].x) {
          snake.direction = 'd';
        }
        break;
      case "ArrowLeft":
        if (snake.segments[index-1].y != snake.segments[index].y) {
          snake.direction = 'l';
        }
        break;
      case "ArrowRight":
        if (snake.segments[index-1].y != snake.segments[index].y) {
          snake.direction = 'r';
        }
        break;     
  }
}

// Function that returns an apple object which x & y positions that aren't equal to any of the snake segments x & y pos.
function spawnApple(){
  
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
  
  appleXPos = randomXNum*PIXEL_SIZE;
  appleYPos = randomYNum*PIXEL_SIZE;
  return new Apple(appleXPos, appleYPos);

}
// 
function drawApple(){
  
  CTX.fillStyle = 'green';
  CTX.fillRect(apple.x, apple.y, PIXEL_SIZE, PIXEL_SIZE);

}
function checkAppleColision(){

  const head = snake.segments[snake.segments.length-1];

  // Check if the apple and snake head are overlapping.
  return apple.x == head.x && apple.y == head.y ? true : false;
}

// Function which checks for the snakes colisions, returns a true boolean if the snake is colliding something it shouldn't.
function checkSnakeColision(){

  const head = snake.segments[snake.segments.length - 1];
  // condition for if the snake is out of gameboard bounderies.
  const isOutOfBounds = head.y < GAMEBOARD_START || head.y > GAMEBOARD_LIMIT || head.x < GAMEBOARD_START || head.x > GAMEBOARD_LIMIT;
  // condition for if snake is overlapping with itself.
  const isBodyOverlap = snake.segments.slice(0, snake.segments.length - 1).some(element => element.x === head.x && element.y === head.y);
 
  return isOutOfBounds || isBodyOverlap;
}
