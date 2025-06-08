// grid.ts

import { ParticleTypes, type ParticleType } from "./particle";

let gridInstanceCounter = 0; // Global counter for grid instances

export class Grid {
  width: number;
  height: number;
  data: Uint8Array;
  activeCells: Set<string>;
  nextActiveCells: Set<string>;
  instanceId: number; // Add an instance ID

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height);
    this.data.fill(ParticleTypes.Empty);
    this.activeCells = new Set();
    this.nextActiveCells = new Set();
    this.instanceId = ++gridInstanceCounter; // Assign a unique ID
    console.log(`Grid instance created: ID ${this.instanceId}`); // Log creation
  }

  addCellAndNeighborsToActive(x: number, y: number) {
    // console.log(`[Grid ID ${this.instanceId}] Adding cell (${x},${y}) and neighbors to nextActiveCells.`); // Keep this if you want
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          this.nextActiveCells.add(`${nx},${ny}`);
        }
      }
    }
  }

  getIndex(x: number, y: number) {
    return y * this.width + x;
  }

  get(x: number, y: number): ParticleType | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.data[this.getIndex(x, y)] as ParticleType;
  }

  set(x: number, y: number, type: ParticleType) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

    const currentIndex = this.getIndex(x, y);
    const originalType = this.data[currentIndex];

    if (originalType !== type) {
      this.data[currentIndex] = type;
      this.addCellAndNeighborsToActive(x, y);
      console.log(`[Grid ID ${this.instanceId}] Particle set at (${x},${y}). Added to nextActiveCells. Size: ${this.nextActiveCells.size}`);
    }
  }

  swap(x1: number, y1: number, x2: number, y2: number) {
    if (x1 < 0 || x1 >= this.width || y1 < 0 || y1 >= this.height ||
        x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) {
        return;
    }

    const idx1 = this.getIndex(x1, y1);
    const idx2 = this.getIndex(x2, y2);

    if (this.data[idx1] !== this.data[idx2]) {
        const temp = this.data[idx1];
        this.data[idx1] = this.data[idx2];
        this.data[idx2] = temp;

        this.addCellAndNeighborsToActive(x1, y1);
        this.addCellAndNeighborsToActive(x2, y2);
    }
  }
}