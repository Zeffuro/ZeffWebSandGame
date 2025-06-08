// particleBehaviors.ts
import { Grid } from './grid';
import { ParticleTypes, DENSITIES, STATES, ParticleState, type ParticleType } from './particle';

// Helper function to read from the oldData snapshot
const getParticleFromOldData = (x: number, y: number, grid: Grid, oldData: Uint8Array): ParticleType => {
    if (x < 0 || x >= grid.width || y < 0 || y >= grid.height) {
        return ParticleTypes.Empty; // Treat out-of-bounds as empty
    }
    return oldData[grid.getIndex(x, y)] as ParticleType;
};

export function handlePlantBehavior(x: number, y: number, grid: Grid, oldData: Uint8Array, newData: Uint8Array) {
    let waterFound = false;
    let flammableNeighbor = false;
    let potentialGrowSpots: { nx: number, ny: number }[] = [];
    let waterConsumedPos: { nx: number, ny: number } | null = null;

    const neighbors = [
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
        { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
    ];

    for (const n of neighbors) {
        const nx = x + n.dx;
        const ny = y + n.dy;
        const neighborType = getParticleFromOldData(nx, ny, grid, oldData);

        if (neighborType === ParticleTypes.Water) {
            waterFound = true;
            waterConsumedPos = { nx, ny };
        } else if (neighborType === ParticleTypes.Empty) {
            potentialGrowSpots.push({ nx, ny });
        } else if (neighborType === ParticleTypes.Fire) {
            flammableNeighbor = true;
        }
    }

    if (flammableNeighbor) {
        newData[grid.getIndex(x, y)] = ParticleTypes.Fire;
        grid.addCellAndNeighborsToActive(x, y); // Mark self and neighbors active
    }
    else if (waterFound && waterConsumedPos && potentialGrowSpots.length > 0) {
        // Consume water
        newData[grid.getIndex(waterConsumedPos.nx, waterConsumedPos.ny)] = ParticleTypes.Empty;
        grid.addCellAndNeighborsToActive(waterConsumedPos.nx, waterConsumedPos.ny); // Mark consumed spot active

        // Grow plant
        const growSpot = potentialGrowSpots[Math.floor(Math.random() * potentialGrowSpots.length)];
        newData[grid.getIndex(growSpot.nx, growSpot.ny)] = ParticleTypes.Plant;
        grid.addCellAndNeighborsToActive(growSpot.nx, growSpot.ny); // Mark new plant spot active
        grid.addCellAndNeighborsToActive(x, y); // Mark original plant spot active (it might have consumed water)
    } else {
        // If no special action, still ensure self is active for next frame
        grid.addCellAndNeighborsToActive(x, y);
    }
}

export function handleFireBehavior(x: number, y: number, grid: Grid, oldData: Uint8Array, newData: Uint8Array) {
    const currentFireType = getParticleFromOldData(x, y, grid, oldData);
    if (currentFireType !== ParticleTypes.Fire) return; // Should already be filtered, but safe check

    const neighbors = [
        { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
        { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
        { dx: 1, dy: 1 }, { dx: -1, dy: 1 },
        { dx: 1, dy: -1 }, { dx: -1, dy: -1 }
    ];

    let hasSpreadOrConsumed = false;
    for (const n of neighbors) {
        const nx = x + n.dx;
        const ny = y + n.dy;
        const neighborType = getParticleFromOldData(nx, ny, grid, oldData);

        // Spread to flammable materials
        if (neighborType === ParticleTypes.Oil || neighborType === ParticleTypes.Plant) {
            // Check if not already fire in newData to prevent overwriting
            if (newData[grid.getIndex(nx, ny)] !== ParticleTypes.Fire) {
                newData[grid.getIndex(nx, ny)] = ParticleTypes.Fire;
                grid.addCellAndNeighborsToActive(nx, ny);
            }
            hasSpreadOrConsumed = true;
        } else if (neighborType === ParticleTypes.Empty) {
            // Randomly spread to empty space (e.g., embers flying)
            if (Math.random() < 0.05) { // Lower chance than burning fuel
                if (newData[grid.getIndex(nx, ny)] !== ParticleTypes.Fire) {
                    newData[grid.getIndex(nx, ny)] = ParticleTypes.Fire;
                    grid.addCellAndNeighborsToActive(nx, ny);
                }
                hasSpreadOrConsumed = true;
            }
        }
    }

    // Determine if fire burns out, turns to smoke, or remains
    if (Math.random() < 0.03) { // 3% chance to turn to Ash
        newData[grid.getIndex(x, y)] = ParticleTypes.Ash;
        grid.addCellAndNeighborsToActive(x, y);
    } else if (Math.random() < 0.05) { // 5% chance to turn to Smoke
        newData[grid.getIndex(x, y)] = ParticleTypes.Smoke;
        grid.addCellAndNeighborsToActive(x, y);
    } else {
        // Fire persists, ensure it's still active for next frame
        grid.addCellAndNeighborsToActive(x, y);
    }
}

export function handleSmokeBehavior(x: number, y: number, grid: Grid, oldData: Uint8Array, newData: Uint8Array) {
    // Smoke dissipates over time
    if (Math.random() < 0.02) { // 2% chance to disappear
        newData[grid.getIndex(x, y)] = ParticleTypes.Empty;
        grid.addCellAndNeighborsToActive(x, y);
    } else {
        // If it doesn't dissipate, ensure it's still active for next frame
        grid.addCellAndNeighborsToActive(x, y);
    }
}