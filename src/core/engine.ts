import { Grid } from './grid';
import { ParticleTypes } from './particle';

export function updateGrid(grid: Grid) {
  for (let y = grid.height - 2; y >= 0; y--) {
    for (let x = 0; x < grid.width; x++) {
      const current = grid.get(x, y);

      if (!current || current === ParticleTypes.Stone) {
        continue;
      }

      switch (current) {
        case ParticleTypes.Sand:
          if (grid.get(x, y + 1) === ParticleTypes.Empty) {
            grid.swap(x, y, x, y + 1);
          } else {
            const canGoLeft = grid.get(x - 1, y + 1) === ParticleTypes.Empty;
            const canGoRight = grid.get(x + 1, y + 1) === ParticleTypes.Empty;

            if (canGoLeft && canGoRight) {
              if (Math.random() < 0.5) {
                grid.swap(x, y, x - 1, y + 1);
              } else {
                grid.swap(x, y, x + 1, y + 1);
              }
            } else if (canGoLeft) {
              grid.swap(x, y, x - 1, y + 1);
            } else if (canGoRight) {
              grid.swap(x, y, x + 1, y + 1);
            }
          }
          break;

        case ParticleTypes.Water:
          const cellBelow = grid.get(x, y + 1);
          if (cellBelow === ParticleTypes.Empty || cellBelow === ParticleTypes.Sand) {
            grid.swap(x, y, x, y + 1);
            break;
          }

          const downLeft = grid.get(x - 1, y + 1);
          const downRight = grid.get(x + 1, y + 1);

          const canFallLeft = downLeft === ParticleTypes.Empty || downLeft === ParticleTypes.Sand;
          const canFallRight = downRight === ParticleTypes.Empty || downRight === ParticleTypes.Sand;

          if (canFallLeft && canFallRight) {
            if (Math.random() < 0.5) {
              grid.swap(x, y, x - 1, y + 1);
            } else {
              grid.swap(x, y, x + 1, y + 1);
            }
            break;
          } else if (canFallLeft) {
            grid.swap(x, y, x - 1, y + 1);
            break;
          } else if (canFallRight) {
            grid.swap(x, y, x + 1, y + 1);
            break;
          }

          const left = grid.get(x - 1, y);
          const right = grid.get(x + 1, y);

          const canFlowLeft = left === ParticleTypes.Empty || left === ParticleTypes.Sand;
          const canFlowRight = right === ParticleTypes.Empty || right === ParticleTypes.Sand;

          if (canFlowLeft && canFlowRight) {
            if (Math.random() < 0.5) {
              grid.swap(x, y, x - 1, y);
            } else {
              grid.swap(x, y, x + 1, y);
            }
          } else if (canFlowLeft) {
            grid.swap(x, y, x - 1, y);
          } else if (canFlowRight) {
            grid.swap(x, y, x + 1, y);
          }
          break;

        default:
          break;
      }
    }
  }
}