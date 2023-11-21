import '../css/style.css';
import { Snake } from './Snake.js';
import { Segment } from './Segment.js';
import { Apple } from './Apple.js';

// general settings
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const pixelSize = 20;
const refreshRate = 100;
const growRate = 10;

// snake starting positions
const snakeStartX = pixelSize;
const snakeStartY = pixelSize*4;

// Game border widths/heights
const gameboarderStart = 0;
const gameboarderLimit = 800;

// Apple spawn limits
const appleSpawnStart = (gameboarderStart/pixelSize) + pixelSize/pixelSize;
const appleSpawnLimit = (gameboarderLimit/pixelSize) - 2 * pixelSize/pixelSize;

// Gameboard widths/heights
const gameboardStart = gameboarderStart + pixelSize;
const gameboardLimit = gameboarderLimit - pixelSize * 2;

let snake = new Snake(snakeStartX , snakeStartY, pixelSize);
let direction = 'r';
let apple = new Apple(pixelSize*8,pixelSize*8);
let gameOver = false;

document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
  updateMoveDirection(code);
}, false);

const move = () => {

  // Draw gameboard limits
  ctx.fillStyle = 'DarkRed';
  ctx.fillRect(gameboarderStart, gameboarderStart, gameboarderLimit, gameboarderLimit);

  // Draw gameboard screen
  ctx.fillStyle = 'black';
  ctx.fillRect(gameboardStart, gameboardStart, gameboardLimit, gameboardLimit);

  // Timer
  setTimeout(() => {
    requestAnimationFrame(move);
  }, refreshRate);

  // Draw snake
  drawSnake();
  // Create new snake head
  createSegment();
  // Remove snake butt
  removeSegment();
  // Draw apple
  drawApple();
  // if snake head touches apple then spawn new apple, add new head
  if (checkAppleColision()) {
    apple = spawnApple();
    for (let i = 0; i < growRate; i++) {
      createSegment();
    }
  }
  // Checks snake colisions with itself and the game borders
  checkSnakeColision();
};

requestAnimationFrame(move);

function drawSnake(){
  for (let i = 0; i < snake.segments.length; i++) {
    const element = snake.segments[i];
    ctx.fillStyle = 'red';
    ctx.fillRect(snake.segments[i].x, snake.segments[i].y, pixelSize, pixelSize);
  }
}
function createSegment(){
  let index = snake.segments.length-1;
  switch (direction) {
    case 'u':
      snake.segments.push(new Segment(snake.segments[index].x,snake.segments[index].y-pixelSize));
      break;
    case 'd':
      snake.segments.push(new Segment(snake.segments[index].x,snake.segments[index].y+pixelSize));
      break;
    case 'l':
      snake.segments.push(new Segment(snake.segments[index].x-pixelSize,snake.segments[index].y));
    break;
    case 'r':
      snake.segments.push(new Segment(snake.segments[index].x+pixelSize,snake.segments[index].y));
      break;
  }
}
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
  }
}
function spawnApple(){
  
  let appleXPos = 999;
  let appleYPos = 999;
  
  let randomXNum;
  let randomYNum;
  
  let xNums = [];
  let yNums = [];

  // Saves all the x and y position values of the different snake segments
  for (let index = 0; index < snake.segments.length; index++) {
    xNums.push(snake.segments[index].x);
    yNums.push(snake.segments[index].y);
  }
  // Generates random numbers between 1-18 (gameboard limits), while the numbers don't equate to any of the segment x & y values
  do {
    randomXNum = Math.floor(Math.random() * appleSpawnLimit)+ appleSpawnStart;
    randomYNum = Math.floor(Math.random() * appleSpawnLimit)+ appleSpawnStart;
    } while (xNums.includes(randomXNum && yNums.includes(randomYNum)));
  
  appleXPos = randomXNum*pixelSize;
  appleYPos = randomYNum*pixelSize;
  return new Apple(appleXPos, appleYPos);
}
function drawApple(){
  ctx.fillStyle = 'green';
  ctx.fillRect(apple.x, apple.y, pixelSize, pixelSize);
}
function checkAppleColision(){
  let head = snake.segments.length-1;
  // Check is apple and snake head overlap
  if (apple.x == snake.segments[head].x && apple.y == snake.segments[head].y) {
    return true;
  }
  return false;
}
function checkSnakeColision(){
  const head = snake.segments[snake.segments.length-1];
  const body = snake.segments.slice(0,snake.segments.length-1)
  // Checks if snake head is within x bounds
  if (head.x <= 0 || head.x >= 760) { 
    return true;
  }
  // Checks if snake head is within y bounds

  return checkY = head.find((element) => element.y <= 0 || element.y >= 760);
  if (head.y <= 0 || head.y >= 760) {
    return true;
  }
  // Checks if snake head overlaps with any segments
  return body.some((element) => element.x === head.x && element.y === head.y);

  // OLD CODE
  // for (let i = 0; i < snake.segments.length-1; i++) {
  //   if (snake.segments[head].x == snake.segments[i].x && snake.segments[head].y == snake.segments[i].y) {
  //     return true;
  //   }
  // }

}
