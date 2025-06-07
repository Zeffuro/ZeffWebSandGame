import type { Grid } from "../core/grid";
import { COLORS, type ParticleType } from "../core/particle";

export class Renderer {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scale: number;
  imageData!: ImageData;

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.scale = scale;
  }

  resizeCanvas(width: number, height: number) {
    this.canvas.width = width * this.scale;
    this.canvas.height = height * this.scale;
    this.imageData = this.ctx.createImageData(width, height);
  }

  draw(grid: Grid) {
    const data = this.imageData.data;
    for (let i = 0; i < grid.data.length; i++) {
      const color = COLORS[grid.data[i] as ParticleType];
      const idx = i * 4;
      data[idx] = color[0];
      data[idx + 1] = color[1];
      data[idx + 2] = color[2];
      data[idx + 3] = 255;
    }

    // Put the image data scaled up on the canvas
    this.ctx.putImageData(this.imageData, 0, 0);
    if (this.scale !== 1) {
      // Scale using drawImage for pixelated look
      this.ctx.imageSmoothingEnabled = false;
      this.ctx.drawImage(
        this.canvas,
        0,
        0,
        grid.width,
        grid.height,
        0,
        0,
        grid.width * this.scale,
        grid.height * this.scale
      );
    }
  }

  setScale(scale: number) {
    this.scale = scale;
  }
}
