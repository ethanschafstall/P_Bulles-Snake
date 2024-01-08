import '../css/style.css';
import { Snake } from './Snake.js';
import { Segment } from './Segment.js';
import { Apple } from './Apple.js';

// general settings.
const CANVAS = document.querySelector('canvas');
const CTX = CANVAS.getContext('2d');
const PIXEL_SIZE = 40;
const REFRESH_RATE = 100;

// Game border widths/heights, the limits of where the snake and apple are allowed to spawn.
const BOARDER_START = 0;
const BOARDER_LIMIT = 800;

// Gameboard widths/heights, where snake and apples spawn.
const GAMEBOARD_START = BOARDER_START + PIXEL_SIZE;
const GAMEBOARD_LIMIT = BOARDER_LIMIT - PIXEL_SIZE * 2;

// General variables.
let snake;
let apple;
let score = 0;
let gameStart = true;

// listener for key presses.
document.addEventListener('keydown', (event) => {
  var code = event.code;
  updateMoveDirection(code);
}, false);

const move = () => {

  // Draw gameboard limits.
  CTX.fillStyle = 'DarkRed';
  CTX.fillRect(BOARDER_START, BOARDER_START, BOARDER_LIMIT, BOARDER_LIMIT);

  // Draw gameboard screen.
  CTX.fillStyle = 'black';
  CTX.fillRect(GAMEBOARD_START, GAMEBOARD_START, GAMEBOARD_LIMIT, GAMEBOARD_LIMIT);

  // for displaying score.
  CTX.font = `${PIXEL_SIZE}px Geo`;
  CTX.fillStyle = "white";
  CTX.textAlign = "center";
  CTX.fillText(`Score: ${score}`, GAMEBOARD_LIMIT / 2 + 16, GAMEBOARD_START - PIXEL_SIZE / 5);

  // Timer.
  setTimeout(() => {
    requestAnimationFrame(move);
  }, REFRESH_RATE);

  
  // Checks if the just started, if true then spawns both the snake and apple.
  gameStart ? (snake = spawnSnake(), apple = spawnApple(), gameStart = false): undefined;

  
  // Draws the snake.
  snake.segments.forEach((e, index, array) => {

    // Check if the index (the snake segment to be drawn) is the last of the array meaning the head of the snake.
    const IS_HEAD = index === array.length - 1;

    drawSegment(e.x, e.y, IS_HEAD);
  });

  // Create new snake head
  updateSnake();
  // Draw apple
  drawApple();

  // Conditions to check for colisions. If apple colision then spawn new apple, grow snake.
  // If snake colision then alert user of gamestate, reload game.
  checkAppleColision() ? (apple = spawnApple(), createSegment(), score++) : undefined;
  checkSnakeColision() ? (alert("You lost!"), gameStart=true, score = 0) : undefined;
};

requestAnimationFrame(move);

// Spawns a snake in a random part of the gameboard and a "random" direction (based on position, not entirely random).
const spawnSnake = () => {
  let randomX;
  let randomY;

  // Generates random x and y position values until both are a multiple of 40 (the pixel size).
  do {
    randomX = getRandomPosition(GAMEBOARD_START, GAMEBOARD_LIMIT);
    randomY = getRandomPosition(GAMEBOARD_START, GAMEBOARD_LIMIT);
  } while (!(randomX % PIXEL_SIZE === 0 && randomY % PIXEL_SIZE === 0));

  // Gets the direction the snake should based on it's spawning position.
  const DIRECTION = determineDirection(randomX, randomY);

  return new Snake(randomX, randomY, DIRECTION);
}

// Function to get a random position within a specified range.
const getRandomPosition = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// Function to determine the traval direction of the snake depending on the largest distance from a border.
const determineDirection = (x, y) => {
  // 4 const with values equating to the x/y distance to a border.
  const [DISTANCE_LEFT, DISTANCE_RIGHT, DISTANCE_TOP, DISTANCE_BOTTOM] = [x - GAMEBOARD_START, GAMEBOARD_LIMIT - x, y - GAMEBOARD_START, GAMEBOARD_LIMIT - y];
  
  // max value of those 4 const
  const MAX_DISTANCE = Math.max(DISTANCE_LEFT, DISTANCE_RIGHT, DISTANCE_TOP, DISTANCE_BOTTOM);


  return MAX_DISTANCE === DISTANCE_LEFT ? "l" : MAX_DISTANCE === DISTANCE_RIGHT ? "r" : MAX_DISTANCE === DISTANCE_TOP ? "u" : "d";
};

// Function for drawing a snake segment.
const drawSegment = (x, y, altColor) => {
  altColor ?  CTX.fillStyle = 'orange' : CTX.fillStyle = 'red'
  CTX.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
}

// Function for creating a new snake segment.
const createSegment = () => {

  // Creates a new segment with the same position values as the first segement in the array (the snake's tail).
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
  }
}

// Function that returns an apple object which x & y positions that aren't equal to any of the snake segments x & y pos.
const spawnApple = () => {
  
  const MAX_COORDINATE = GAMEBOARD_LIMIT / PIXEL_SIZE;
  const MIN_COORDINATE = GAMEBOARD_START / PIXEL_SIZE;

  let newX;
  let newY;
  
  let randomX;
  let randomY;

  // Extracts all of the x and y values from each snake segment objects and saves into an array.
  const X_VALUES = snake.segments.map(a => a.x);
  const Y_VALUES = snake.segments.map(a => a.y);
  

  // Generates random numbers between 1-18 (gameboard limits), while the numbers don't equate to any of the segment x & y values.
  do {
    randomX = Math.floor(Math.random() * MAX_COORDINATE) + MIN_COORDINATE;
    randomY = Math.floor(Math.random() * MAX_COORDINATE) + MIN_COORDINATE;
    } while (X_VALUES.includes(randomX) && Y_VALUES.includes(randomY));
  
  // new x and y values become the randomly generated values, multiplied by pixelsize so the position fits within gameboard grid.
  newX = randomX * PIXEL_SIZE;
  newY = randomY * PIXEL_SIZE;

  return new Apple(newX, newY);

}
// Function which draws apple using it's x and y cords.
const drawApple = () => {
  
  CTX.fillStyle = 'green';
  CTX.fillRect(apple.x, apple.y, PIXEL_SIZE, PIXEL_SIZE);

}
// Function which which returns a conditional variable if the apple and snake head are overlapping.
const checkAppleColision = () => {

  const HEAD = snake.segments[snake.segments.length-1];

  // Check if the apple and snake head are overlapping.
  return apple.x == HEAD.x && apple.y == HEAD.y ? true : false;
}

// Function which checks for the snakes colisions, returns a true boolean if the snake is colliding something it shouldn't.
const checkSnakeColision = () => {

  const HEAD = snake.segments[snake.segments.length - 1];
  // condition for if the snake is out of gameboard bounderies.
  const IS_OUT_OF_BOUNDS = HEAD.y < GAMEBOARD_START || HEAD.y > GAMEBOARD_LIMIT || HEAD.x < GAMEBOARD_START || HEAD.x > GAMEBOARD_LIMIT;
  // condition for if snake is overlapping with itself.
  const IS_BODY_OVERLAP = snake.segments.slice(0, snake.segments.length - 1).some(element => element.x === HEAD.x && element.y === HEAD.y);
 
  return IS_OUT_OF_BOUNDS || IS_BODY_OVERLAP;
}
