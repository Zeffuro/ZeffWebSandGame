import { Grid } from './grid';
import { ParticleTypes, DENSITIES, STATES, ParticleState } from './particle';

export function updateGrid(grid: Grid) {
  for (let y = grid.height - 2; y >= 0; y--) {
    for (let x = 0; x < grid.width; x++) {
      const currentType = grid.get(x, y);

      if (currentType === null || currentType === ParticleTypes.Empty) {
        continue;
      }

      const currentDensity = DENSITIES[currentType];
      const currentState = STATES[currentType];

      if (currentState === ParticleState.Static) {
        continue;
      }

      const belowType = grid.get(x, y + 1);

      if (belowType !== null && STATES[belowType] === ParticleState.Static) {
          continue;
      }

      if (currentState === ParticleState.Solid && DENSITIES[grid.get(x, y + 1)!] > currentDensity) {
          continue;
      }

      if (belowType !== null && currentDensity > DENSITIES[belowType]) {
        grid.swap(x, y, x, y + 1);
        continue;
      }

      const canFallLeft = grid.get(x - 1, y + 1);
      const canFallRight = grid.get(x + 1, y + 1);
      const leftDensity = canFallLeft !== null ? DENSITIES[canFallLeft] : Infinity;
      const rightDensity = canFallRight !== null ? DENSITIES[canFallRight] : Infinity;

      const canSlideLeft = currentDensity > leftDensity && (canFallLeft === null || STATES[canFallLeft] !== ParticleState.Static);
      const canSlideRight = currentDensity > rightDensity && (canFallRight === null || STATES[canFallRight] !== ParticleState.Static);

      if (canSlideLeft && canSlideRight) {
        grid.swap(x, y, Math.random() < 0.5 ? x - 1 : x + 1, y + 1);
        continue;
      } else if (canSlideLeft) {
        grid.swap(x, y, x - 1, y + 1);
        continue;
      } else if (canSlideRight) {
        grid.swap(x, y, x + 1, y + 1);
        continue;
      }

      if (currentState === ParticleState.Liquid || currentState === ParticleState.Gas) {
        const direction = Math.random() < 0.5 ? -1 : 1;

        const side1 = grid.get(x + direction, y);
        const side2 = grid.get(x - direction, y);

        if (side1 === ParticleTypes.Empty) {
            grid.swap(x, y, x + direction, y);
        } else if (side2 === ParticleTypes.Empty) {
            grid.swap(x, y, x - direction, y);
        }
      }
    }
  }
}