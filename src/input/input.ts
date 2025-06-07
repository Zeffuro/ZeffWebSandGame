import type { Grid } from '../core/grid';
import type { Renderer } from '../renderer/renderer';
import { ParticleTypes, type ParticleType } from '../core/particle';

// Add these variables outside (above) the setupInput function
let lastMouseGridX: number | null = null;
let lastMouseGridY: number | null = null;
let currentParticleType: ParticleType = ParticleTypes.Sand;
let currentBrushSize: number = 1;

export function setParticleType(type: ParticleType) {
  currentParticleType = type;
}

export function setBrushSize(size: number) {
  currentBrushSize = size;
}

export function setupInput(canvas: HTMLCanvasElement, grid: Grid, renderer: Renderer) {
  let isDrawing = false;

  function updateMouseGridPosition(e: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    lastMouseGridX = Math.floor(mouseX / renderer.scale);
    lastMouseGridY = Math.floor(mouseY / renderer.scale);
  }

  function drawBrush(centerX: number, centerY: number, type: ParticleType, gridInstance: Grid) {
    const halfSize = Math.floor(currentBrushSize / 2);
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
        gridInstance.set(centerX + dx, centerY + dy, type);
      }
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    updateMouseGridPosition(e);
    if (lastMouseGridX !== null && lastMouseGridY !== null) {
        drawBrush(lastMouseGridX, lastMouseGridY, currentParticleType, grid);
    }
  });

  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    lastMouseGridX = null;
    lastMouseGridY = null;
  });

  canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
    lastMouseGridX = null;
    lastMouseGridY = null;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
      updateMouseGridPosition(e);
      if (lastMouseGridX !== null && lastMouseGridY !== null){
        grid.set(lastMouseGridX, lastMouseGridY, currentParticleType);
      }
    }
  });

  (window as any).drawIfMouseHeld = function(gridInstance: Grid) {
    if (isDrawing && lastMouseGridX !== null && lastMouseGridY !== null) {
      if (
        lastMouseGridX >= 0 && lastMouseGridX < gridInstance.width &&
        lastMouseGridY >= 0 && lastMouseGridY < gridInstance.height
      ){
        drawBrush(lastMouseGridX, lastMouseGridY, currentParticleType, gridInstance);
        return true;
      }
    }
    return false;
  };
}