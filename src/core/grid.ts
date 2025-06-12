import { ParticleTypes, type ParticleType } from "./particle";

let gridInstanceCounter = 0;

export class Grid {
  width: number;
  height: number;
  data: Uint8Array;
  activeCells: Set<string>;
  nextActiveCells: Set<string>; // This will be populated by cells that *need* to be checked next
  instanceId: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height);
    this.data.fill(ParticleTypes.Empty);
    this.activeCells = new Set<string>();
    this.nextActiveCells = new Set<string>();
    this.instanceId = ++gridInstanceCounter;
  }

  // Only adds the given cell (x,y) to nextActiveCells.
  // Its neighbors will be implicitly added if they also change or if a particle moves into them.
  markCellActive(x: number, y: number) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.nextActiveCells.add(`${x},${y}`);
    }
  }

  getIndex(x: number, y: number) {
    return y * this.width + x;
  }

  get(x: number, y: number): ParticleType | null {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null;
    return this.data[this.getIndex(x, y)] as ParticleType;
  }

  setInArray(targetData: Uint8Array, x: number, y: number, type: ParticleType) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;

    const index = this.getIndex(x, y);
    const originalType = targetData[index];

    if (originalType !== type) {
      targetData[index] = type;
      // If cell (x,y) changed, it and its neighbors need to be active for next frame
      this.markCellActive(x, y);
      this.markCellActive(x - 1, y - 1); this.markCellActive(x, y - 1); this.markCellActive(x + 1, y - 1);
      this.markCellActive(x - 1, y);   this.markCellActive(x + 1, y);
      this.markCellActive(x - 1, y + 1); this.markCellActive(x, y + 1); this.markCellActive(x + 1, y + 1);
    }
  }

  swapInArray(targetData: Uint8Array, x1: number, y1: number, x2: number, y2: number) {
    if (x1 < 0 || x1 >= this.width || y1 < 0 || y1 >= this.height ||
        x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) {
        return;
    }

    const idx1 = this.getIndex(x1, y1);
    const idx2 = this.getIndex(x2, y2);

    if (targetData[idx1] !== targetData[idx2]) {
        const temp = targetData[idx1];
        targetData[idx1] = targetData[idx2];
        targetData[idx2] = temp;

        // If cells (x1,y1) and (x2,y2) swapped, they and their neighbors need to be active
        this.markCellActive(x1, y1);
        this.markCellActive(x1 - 1, y1 - 1); this.markCellActive(x1, y1 - 1); this.markCellActive(x1 + 1, y1 - 1);
        this.markCellActive(x1 - 1, y1);   this.markCellActive(x1 + 1, y1);
        this.markCellActive(x1 - 1, y1 + 1); this.markCellActive(x1, y1 + 1); this.markCellActive(x1 + 1, y1 + 1);

        this.markCellActive(x2, y2);
        this.markCellActive(x2 - 1, y2 - 1); this.markCellActive(x2, y2 - 1); this.markCellActive(x2 + 1, y2 - 1);
        this.markCellActive(x2 - 1, y2);   this.markCellActive(x2 + 1, y2);
        this.markCellActive(x2 - 1, y2 + 1); this.markCellActive(x2, y2 + 1); this.markCellActive(x2 + 1, y2 + 1);
    }
  }

  // For direct manipulation (e.g., mouse drawing)
  set(x: number, y: number, type: ParticleType) {
    const index = this.getIndex(x,y);
    if(this.data[index] !== type) {
      this.data[index] = type;
      // When drawing, immediately mark for next frame's active processing
      this.markCellActive(x, y);
      this.markCellActive(x - 1, y - 1); this.markCellActive(x, y - 1); this.markCellActive(x + 1, y - 1);
      this.markCellActive(x - 1, y);   this.markCellActive(x + 1, y);
      this.markCellActive(x - 1, y + 1); this.markCellActive(x, y + 1); this.markCellActive(x + 1, y + 1);
    }
  }

  swap(x1: number, y1: number, x2: number, y2: number) {
    const idx1 = this.getIndex(x1, y1);
    const idx2 = this.getIndex(x2, y2);

    if (this.data[idx1] !== this.data[idx2]) {
      const temp = this.data[idx1];
      this.data[idx1] = this.data[idx2];
      this.data[idx2] = temp;

      this.markCellActive(x1, y1);
      this.markCellActive(x1 - 1, y1 - 1); this.markCellActive(x1, y1 - 1); this.markCellActive(x1 + 1, y1 - 1);
      this.markCellActive(x1 - 1, y1);   this.markCellActive(x1 + 1, y1);
      this.markCellActive(x1 - 1, y1 + 1); this.markCellActive(x1, y1 + 1); this.markCellActive(x1 + 1, y1 + 1);

      this.markCellActive(x2, y2);
      this.markCellActive(x2 - 1, y2 - 1); this.markCellActive(x2, y2 - 1); this.markCellActive(x2 + 1, y2 - 1);
      this.markCellActive(x2 - 1, y2);   this.markCellActive(x2 + 1, y2);
      this.markCellActive(x2 - 1, y2 + 1); this.markCellActive(x2, y2 + 1); this.markCellActive(x2 + 1, y2 + 1);
    }
  }
}