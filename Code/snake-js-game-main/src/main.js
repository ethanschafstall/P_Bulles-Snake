import '../css/style.css';
import { Snake } from './Snake.js';
import { Segment } from './Segment.js';
import { Apple } from './Apple.js';

// general settings
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const pixelSize = 40;
const refreshRate = 100;

// snake starting positions
const snakeStartX = pixelSize;
const snakeStartY = pixelSize*4;

// Game border widths/heights
const gameboarderStart = 0;
const gameboarderLimit = 800;
// Apple spawn limidts
const appleSpawnStart = (gameboarderStart/pixelSize) + pixelSize/pixelSize;
const appleSpawnLimit = (gameboarderLimit/pixelSize) - 2 * pixelSize/pixelSize;

// Gameboard widths/heights
const gameboardStart = gameboarderStart + pixelSize;
const gameboardLimit = gameboarderLimit - pixelSize * 2;


let snake = new Snake(snakeStartX , snakeStartY, pixelSize);
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
  ctx.fillStyle = 'DarkRed';
  ctx.fillRect(gameboarderStart, gameboarderStart, gameboarderLimit, gameboarderLimit);

  // Draw gameboard screen
  ctx.fillStyle = 'black';
  ctx.fillRect(gameboardStart, gameboardStart, gameboardLimit, gameboardLimit);

  ctx.font = `${pixelSize}px Geo`;
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${score}`, gameboardLimit/2+16, gameboardStart-pixelSize/5); 

  // Timer
  setTimeout(() => {
    requestAnimationFrame(move);
  }, refreshRate);

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
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, pixelSize, pixelSize);
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

  const head = snake.segments[snake.segments.length-1];

  // Check is apple and snake head overlap
  return apple.x == head.x && apple.y == head.y ? true : false;
}

// Function which checks for the snakes colisions, returns a true boolean if the snake is colliding something it shouldn't (hence gameover).
function checkSnakeColision(){

  const head = snake.segments[snake.segments.length-1];
  const body = snake.segments.slice(0,snake.segments.length-1)

  // Checks if snake head is within gameboard x & y bounds, or if the snake head overlaps with any segments.
  return (head.y < gameboardStart) || (head.y > gameboardLimit) || (head.x < gameboardStart) || (head.x > gameboardLimit) 
  || (body.some((element) => element.x === head.x && element.y === head.y));
}
