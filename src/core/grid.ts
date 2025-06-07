import { ParticleTypes, type ParticleType } from "./particle";

export class Grid {
  width: number;
  height: number;
  data: Uint8Array;
  activeCells: Set<string>;
  nextActiveCells: Set<string>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height);
    // Initialize to empty
    this.data.fill(ParticleTypes.Empty);
    this.activeCells = new Set();
    this.nextActiveCells = new Set();
  }

  addCellAndNeighborsToActive(x: number, y: number) {
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
    this.data[this.getIndex(x, y)] = type;
    if (this.data[y * this.width + x] !== type) {
      this.data[y * this.width + x] = type;
      this.addCellAndNeighborsToActive(x, y);
    }
  }

  swap(x1: number, y1: number, x2: number, y2: number) {
    const idx1 = this.getIndex(x1, y1);
    const idx2 = this.getIndex(x2, y2);
    const temp = this.data[idx1];
    this.data[idx1] = this.data[idx2];
    this.data[idx2] = temp;
    this.addCellAndNeighborsToActive(x1, y1);
    this.addCellAndNeighborsToActive(x2, y2);
  }
}