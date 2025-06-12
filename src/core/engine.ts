import { Grid } from './grid';
import { ParticleTypes, DENSITIES, STATES, ParticleState, type ParticleType } from './particle';
import { handlePlantBehavior, handleFireBehavior, handleSmokeBehavior } from './particleBehaviors';

function getParticleType(grid: Grid, data: Uint8Array, x: number, y: number): ParticleType | null {
  if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
    return null;
  }
  return data[grid.getIndex(x, y)] as ParticleType;
}

export function updateGrid(grid: Grid) {
  const oldData = new Uint8Array(grid.data);
  const newData = new Uint8Array(oldData);

  const cellsToProcess = new Set(grid.activeCells);
  grid.nextActiveCells.clear();

  for (const cellKey of cellsToProcess) {
    const [xStr, yStr] = cellKey.split(',');
    const x = parseInt(xStr, 10);
    const y = parseInt(yStr, 10);

    const currentType: ParticleType = oldData[grid.getIndex(x, y)] as ParticleType;

    if (currentType === ParticleTypes.Empty) {
      continue;
    }

    const currentDensity = DENSITIES[currentType];
    const currentState = STATES[currentType];

    let particleMovedInThisFrame = false;

    switch (currentType) {
      case ParticleTypes.Plant:
        particleMovedInThisFrame = handlePlantBehavior(x, y, grid, oldData, newData);
        break;
      case ParticleTypes.Fire:
        particleMovedInThisFrame = handleFireBehavior(x, y, grid, oldData, newData);
        break;
      case ParticleTypes.Smoke:
        particleMovedInThisFrame = handleSmokeBehavior(x, y, grid, oldData, newData);
        break;
    }

    if (particleMovedInThisFrame) {
      continue;
    }

    if (currentState === ParticleState.Static) {
      continue;
    }

    const belowType = getParticleType(grid, oldData, x, y + 1);
    if (belowType !== null && currentDensity > DENSITIES[belowType]) {
      grid.swapInArray(newData, x, y, x, y + 1);
      particleMovedInThisFrame = true;
    } else if (belowType !== null && STATES[belowType] === ParticleState.Static) {

    } else {
      const canFallLeftType = getParticleType(grid, oldData, x - 1, y + 1);
      const canFallRightType = getParticleType(grid, oldData, x + 1, y + 1);

      const leftDensity = (canFallLeftType !== null) ? DENSITIES[canFallLeftType] : Infinity;
      const rightDensity = (canFallRightType !== null) ? DENSITIES[canFallRightType] : Infinity;

      const canSlideLeft = currentDensity > leftDensity && (canFallLeftType === null || STATES[canFallLeftType] !== ParticleState.Static);
      const canSlideRight = currentDensity > rightDensity && (canFallRightType === null || STATES[canFallRightType] !== ParticleState.Static);

      if (canSlideLeft && canSlideRight) {
        const targetX = Math.random() < 0.5 ? x - 1 : x + 1;
        grid.swapInArray(newData, x, y, targetX, y + 1);
        particleMovedInThisFrame = true;
      } else if (canSlideLeft) {
        grid.swapInArray(newData, x, y, x - 1, y + 1);
        particleMovedInThisFrame = true;
      } else if (canSlideRight) {
        grid.swapInArray(newData, x, y, x + 1, y + 1);
        particleMovedInThisFrame = true;
      }
    }

    if (!particleMovedInThisFrame && (currentState === ParticleState.Liquid || currentState === ParticleState.Gas)) {
      const direction = Math.random() < 0.5 ? -1 : 1;

      const side1Type = getParticleType(grid, oldData, x + direction, y);
      const side2Type = getParticleType(grid, oldData, x - direction, y);

      const side1Density = (side1Type !== null) ? DENSITIES[side1Type] : Infinity;
      const side2Density = (side2Type !== null) ? DENSITIES[side2Type] : Infinity;

      if (currentDensity > side1Density && (side1Type === null || STATES[side1Type] !== ParticleState.Static)) {
        grid.swapInArray(newData, x, y, x + direction, y);
        particleMovedInThisFrame = true;
      } else if (currentDensity > side2Density && (side2Type === null || STATES[side2Type] !== ParticleState.Static)) {
        grid.swapInArray(newData, x, y, x - direction, y);
        particleMovedInThisFrame = true;
      }
    }
  }

  grid.data.set(newData);
  grid.activeCells = grid.nextActiveCells;
}