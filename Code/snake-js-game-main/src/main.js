import '../css/style.css';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const move = () => {

  // Dessine la grille de jeu
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 800, 800);

  // Rafraichit à chaque seconde
  setTimeout(() => {
    requestAnimationFrame(move);
  }, 1000);
  
};

requestAnimationFrame(move);
