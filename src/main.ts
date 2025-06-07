import { Grid } from './core/grid';
import { updateGrid } from './core/engine';
import { Renderer } from './renderer/renderer';
import { setBrushSize, setParticleType } from './input/input';
import { setupInput } from './input/input';
import { setupUI } from './ui/ui';

declare global {
  interface Window {
    drawIfMouseHeld: (grid: Grid, renderer: Renderer) => boolean;
  }
}

const GRID_WIDTH = 800;
const GRID_HEIGHT = 600;
let scale = 1;

const canvas = document.querySelector('canvas')!;
const grid = new Grid(GRID_WIDTH, GRID_HEIGHT);
const renderer = new Renderer(canvas, scale);

function gameLoop() {
  window.drawIfMouseHeld(grid, renderer);
  updateGrid(grid);
  renderer.draw(grid);
  requestAnimationFrame(gameLoop);
}

function setAppScale(newScale: number) {
  scale = newScale;
  renderer.setScale(scale);
  renderer.resizeCanvas(GRID_WIDTH, GRID_HEIGHT);
}

setupInput(canvas, grid, renderer);
setupUI(setAppScale, setBrushSize, setParticleType);

document.getElementById('scale1')?.addEventListener('click', () => {
  setAppScale(1);
});
document.getElementById('scale2')?.addEventListener('click', () => {
  setAppScale(2);
});
document.getElementById('scale4')?.addEventListener('click', () => {
  setAppScale(4);
});

renderer.resizeCanvas(GRID_WIDTH, GRID_HEIGHT);
renderer.draw(grid);

requestAnimationFrame(gameLoop);