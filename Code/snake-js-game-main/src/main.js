import '../css/style.css';
import { Snake } from './Snake.js';
import { Segment } from './Segment.js';
import { Apple } from './Apple.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const pixelSize = 40;
let snake = new Snake(pixelSize,pixelSize*6, pixelSize);
let direction = 'r';
let apple = new Apple(pixelSize*8,pixelSize*8);

document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
  updateMoveDirection(code);
}, false);

const move = () => {

  // Dessine la grille de jeu
  ctx.fillStyle = 'DarkRed';
  ctx.fillRect(0, 0, 800, 800);
  ctx.fillStyle = 'black';
  ctx.fillRect(pixelSize, pixelSize, 720, 720);
  // Rafraichit à chaque seconde
  setTimeout(() => {
    requestAnimationFrame(move);
  }, 150);
  drawSnake();
  createSegment();
  removeSegment();
  drawApple();
  if (checkAppleColision()) {
    apple = spawnApple();
    createSegment();
  }
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

  for (let index = 0; index < snake.segments.length; index++) {
    xNums.push(snake.segments[index].x);
    yNums.push(snake.segments[index].y);
  }
  do {
    randomXNum = Math.floor(Math.random() * 18)
  } while (xNums.includes(randomXNum));
  do {
    randomYNum = Math.floor(Math.random() * 18)
  } while (yNums.includes(randomYNum));

  appleXPos = randomXNum*40;
  appleYPos = randomYNum*40;
  console.log(appleXPos);
  console.log(appleYPos);
  return new Apple(appleXPos, appleYPos);
}
function drawApple(){
  ctx.fillStyle = 'green';
  ctx.fillRect(apple.x, apple.y, pixelSize, pixelSize);
}
function checkAppleColision(){
  let index = snake.segments.length-1;
  if (apple.x == snake.segments[index].x) {
    if (apple.y == snake.segments[index].y){
      return true;
    }
  }
  return false;
}

