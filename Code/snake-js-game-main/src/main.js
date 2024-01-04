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
// Apple spawn limidts
const APPLE_SPAWN_START = (BOARDER_START/PIXEL_SIZE) + PIXEL_SIZE/PIXEL_SIZE;
const APPLE_SPAWN_LIMIT = (BOARDER_LIMIT/PIXEL_SIZE) - 2 * PIXEL_SIZE/PIXEL_SIZE;

// Gameboard widths/heights
const GAMEBOARD_START = BOARDER_START + PIXEL_SIZE;
const GAMEBOARD_LIMIT = BOARDER_LIMIT - PIXEL_SIZE * 2;


let snake = new Snake(SNAKE_START_X , SNAKE_START_Y, PIXEL_SIZE);
let apple;
let gameOver = false;
let direction = 'r';
let score = 0;
let gameStart = true;
let growRate = 2;

document.addEventListener('keydown', (event) => {
  var name = event.key;
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
  CTX.fillText(`Score: ${score}`, GAMEBOARD_LIMIT/2+16, GAMEBOARD_START-PIXEL_SIZE/5); 

  // Timer
  setTimeout(() => {
    requestAnimationFrame(move);
  }, REFRESH_RATE);

  //
  gameStart ? (apple = spawnApple(), gameStart = false): undefined;

  // Draw snake
  snake.segments.forEach(e => drawSegment(e.x, e.y));
  // Create new snake head
  createSegment();
  // Remove snake butt
  removeSegment();
  // Draw apple
  drawApple();

  checkAppleColision() ? (apple = spawnApple(), repeatFor(growRate, createSegment), score++) : undefined;

  checkSnakeColision() ? location.reload() : undefined;
};

requestAnimationFrame(move);
// Function for drawing a snake segment
function drawSegment(x, y){
    CTX.fillStyle = 'red';
    CTX.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
}

function repeatFor(number, myFunction){
  for (let index = 0; index < number; index++) {
    myFunction();
  }
}

// Function for creating a new snake segment
function createSegment(){
  
  let index = snake.segments.length-1;
  switch (direction) {
    case 'u':
      snake.segments.push(new Segment(snake.segments[index].x,snake.segments[index].y-PIXEL_SIZE));
      break;
    case 'd':
      snake.segments.push(new Segment(snake.segments[index].x,snake.segments[index].y+PIXEL_SIZE));
      break;
    case 'l':
      snake.segments.push(new Segment(snake.segments[index].x-PIXEL_SIZE,snake.segments[index].y));
    break;
    case 'r':
      snake.segments.push(new Segment(snake.segments[index].x+PIXEL_SIZE,snake.segments[index].y));
      break;
      
  }
}
// Function for removing a snake segment
function removeSegment(){
  
  snake.segments.shift();
  
}

function updateMoveDirection(keyPressed){
 
  let index = snake.segments.length-1;

  switch (keyPressed) {
    case "KeyW":
      if (snake.segments[index-1].x != snake.segments[index].x) {
        direction = 'u';
      }
      break;
    case "KeyS":
      if (snake.segments[index-1].x != snake.segments[index].x) {
        direction = 'd';
      }
      break;
    case "KeyA":
      if (snake.segments[index-1].y != snake.segments[index].y) {
        direction = 'l';
      }
      break;
    case "KeyD":
      if (snake.segments[index-1].y != snake.segments[index].y) {
        direction = 'r';
      }
      break;
    case "ArrowUp":
      if (snake.segments[index-1].x != snake.segments[index].x) {
        direction = 'u';
      }
      break;
      case "ArrowDown":
        if (snake.segments[index-1].x != snake.segments[index].x) {
          direction = 'd';
        }
        break;
      case "ArrowLeft":
        if (snake.segments[index-1].y != snake.segments[index].y) {
          direction = 'l';
        }
        break;
      case "ArrowRight":
        if (snake.segments[index-1].y != snake.segments[index].y) {
          direction = 'r';
        }
        break;     
  }
}
function spawnApple(){
  
  let appleXPos = 999;
  let appleYPos = 999;
  
  let randomXNum;
  let randomYNum;

  let xNums = snake.segments.map(a => a.x);
  let yNums = snake.segments.map(a => a.y);
  

  // Generates random numbers between 1-18 (gameboard limits), while the numbers don't equate to any of the segment x & y values
  do {
    randomXNum = Math.floor(Math.random() * APPLE_SPAWN_LIMIT)+ APPLE_SPAWN_START;
    randomYNum = Math.floor(Math.random() * APPLE_SPAWN_LIMIT)+ APPLE_SPAWN_START;
    } while (xNums.includes(randomXNum && yNums.includes(randomYNum)));
  
  appleXPos = randomXNum*PIXEL_SIZE;
  appleYPos = randomYNum*PIXEL_SIZE;
  return new Apple(appleXPos, appleYPos);

}
function drawApple(){
  
  CTX.fillStyle = 'green';
  CTX.fillRect(apple.x, apple.y, PIXEL_SIZE, PIXEL_SIZE);

}
function checkAppleColision(){

  const head = snake.segments[snake.segments.length-1];

  // Check is apple and snake head overlap
  return apple.x == head.x && apple.y == head.y ? true : false;
}

// Function which checks for the snakes colisions, returns a true boolean if the snake is colliding something it shouldn't (hence gameover).
function checkSnakeColision(){

  const head = snake.segments[snake.segments.length-1];
  const body = snake.segments.slice(0,snake.segments.length-1)

  // Checks if snake head is within gameboard x & y bounds, or if the snake head overlaps with any segments.
  return (head.y < GAMEBOARD_START) || (head.y > GAMEBOARD_LIMIT) || (head.x < GAMEBOARD_START) || (head.x > GAMEBOARD_LIMIT) 
  || (body.some((element) => element.x === head.x && element.y === head.y));
}
