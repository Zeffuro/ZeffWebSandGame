import type { Grid } from '../core/grid';
import type { Renderer } from '../renderer/renderer';
import { ParticleTypes, type ParticleType } from '../core/particle';

let currentPointGridX: number | null = null;
let currentPointGridY: number | null = null;
let prevPointGridX: number | null = null;
let prevPointGridY: number | null = null;

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

  function drawBrush(centerX: number, centerY: number, type: ParticleType, gridInstance: Grid) {
    const halfSize = Math.floor(currentBrushSize / 2);
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
        const targetX = centerX + dx;
        const targetY = centerY + dy;

        if (targetX >= 0 && targetX < gridInstance.width &&
            targetY >= 0 && targetY < gridInstance.height) {
          gridInstance.set(targetX, targetY, type);
        }
      }
    }
  }


  function calculateGridCoords(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((clientX - rect.left) / renderer.scale);
    const y = Math.floor((clientY - rect.top) / renderer.scale);
    return { x, y };
  }

  function startDrawing(clientX: number, clientY: number) {
    isDrawing = true;
    const { x, y } = calculateGridCoords(clientX, clientY);

    currentPointGridX = x;
    currentPointGridY = y;
    prevPointGridX = x;
    prevPointGridY = y;

    if (currentPointGridX !== null && currentPointGridY !== null) {
      drawBrush(currentPointGridX, currentPointGridY, currentParticleType, grid);
    }
  }

  function moveDrawing(clientX: number, clientY: number) {
    if (!isDrawing) return;

    const { x: currentX, y: currentY } = calculateGridCoords(clientX, clientY);

    if (prevPointGridX !== null && prevPointGridY !== null &&
        (currentX !== prevPointGridX || currentY !== prevPointGridY)) {

      const x0 = prevPointGridX;
      const y0 = prevPointGridY;
      const x1 = currentX;
      const y1 = currentY;

      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const steps = Math.max(dx, dy);

      for (let i = 0; i <= steps; i++) {
        const interpX = Math.round(x0 + (x1 - x0) * (i / steps));
        const interpY = Math.round(y0 + (y1 - y0) * (i / steps));
        drawBrush(interpX, interpY, currentParticleType, grid);
      }
    } else if (prevPointGridX === null && prevPointGridY === null) {
        drawBrush(currentX, currentY, currentParticleType, grid);
    }

    prevPointGridX = currentX;
    prevPointGridY = currentY;
    currentPointGridX = currentX;
    currentPointGridY = currentY;
  }

  function endDrawing() {
    isDrawing = false;
    currentPointGridX = null;
    currentPointGridY = null;
    prevPointGridX = null;
    prevPointGridY = null;
  }

  canvas.addEventListener('mousedown', (e) => {
    startDrawing(e.clientX, e.clientY);
  });

  canvas.addEventListener('mousemove', (e) => {
    moveDrawing(e.clientX, e.clientY);
  });

  canvas.addEventListener('mouseup', endDrawing);
  canvas.addEventListener('mouseleave', endDrawing);

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      startDrawing(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      moveDrawing(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: false });

  canvas.addEventListener('touchend', endDrawing);
  canvas.addEventListener('touchcancel', endDrawing);
 
  (window as any).drawIfMouseHeld = function(gridInstance: Grid) {
    if (isDrawing && currentPointGridX !== null && currentPointGridY !== null) {
      if (
        currentPointGridX >= 0 && currentPointGridX < gridInstance.width &&
        currentPointGridY >= 0 && currentPointGridY < gridInstance.height
      ){
        drawBrush(currentPointGridX, currentPointGridY, currentParticleType, gridInstance);
        return true;
      }
    }
    return false;
  };
}