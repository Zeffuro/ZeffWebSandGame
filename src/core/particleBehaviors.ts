import { Grid } from './grid';
import { ParticleTypes, type ParticleType } from './particle'; // Add 'type' keyword for ParticleType

function getParticleType(grid: Grid, data: Uint8Array, x: number, y: number): ParticleType | null {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return null;
  }
  return data[grid.getIndex(x, y)] as ParticleType;
}

export function handlePlantBehavior(x: number, y: number, grid: Grid, oldData: Uint8Array, newData: Uint8Array): boolean {
  if (Math.random() < 0.005) {
    const belowType = getParticleType(grid, oldData, x, y + 1);
    if (belowType === ParticleTypes.Empty) {
      grid.setInArray(newData, x, y + 1, ParticleTypes.Plant);
      return true;
    }
  }

  const dx = Math.floor(Math.random() * 3) - 1;
  const dy = Math.floor(Math.random() * 3) - 1;
  if (dx !== 0 || dy !== 0) {
    const neighborType = getParticleType(grid, oldData, x + dx, y + dy);
    if (neighborType === ParticleTypes.Fire) {
      grid.setInArray(newData, x, y, ParticleTypes.Ash);
      return true;
    }
  }

  return false;
}

export function handleFireBehavior(x: number, y: number, grid: Grid, oldData: Uint8Array, newData: Uint8Array): boolean {
  if (Math.random() < 0.05) {
    grid.setInArray(newData, x, y, Math.random() < 0.9 ? ParticleTypes.Ash : ParticleTypes.Smoke);
    return true;
  }

  const dx = Math.floor(Math.random() * 3) - 1;
  const dy = Math.floor(Math.random() * 3) - 1;
  if (dx === 0 && dy === 0) return false;

  const nx = x + dx;
  const ny = y + dy;
  const neighborType = getParticleType(grid, oldData, nx, ny);

  if (neighborType === ParticleTypes.Plant || neighborType === ParticleTypes.Oil) {
    if (newData[grid.getIndex(nx, ny)] !== ParticleTypes.Fire) {
      grid.setInArray(newData, nx, ny, ParticleTypes.Fire);
      return true;
    }
  }

  return false;
}

export function handleSmokeBehavior(x: number, y: number, grid: Grid, oldData: Uint8Array, newData: Uint8Array): boolean {
  if (Math.random() < 0.01) {
    grid.setInArray(newData, x, y, ParticleTypes.Empty);
    return true;
  }

  const aboveType = getParticleType(grid, oldData, x, y - 1);
  if (aboveType === ParticleTypes.Empty) {
    grid.swapInArray(newData, x, y, x, y - 1);
    return true;
  }

  const direction = Math.random() < 0.5 ? 1 : -1;
  const diagonalNeighbor = getParticleType(grid, oldData, x + direction, y - 1);
  if (diagonalNeighbor === ParticleTypes.Empty) {
    grid.swapInArray(newData, x, y, x + direction, y - 1);
    return true;
  }

  return false;
}