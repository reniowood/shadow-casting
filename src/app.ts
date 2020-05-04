import Map from './map';
import Canvas from './canvas';

export default class App {
  private readonly map: Map;
  private readonly canvas: Canvas;
  private readonly fps: number;

  constructor(size: number, scale: number, fps: number) {
    this.map = new Map(size / scale);
    this.canvas = new Canvas(size, this.map);
    this.fps = fps;
  }

  run() {
    setInterval(() => {
      this.canvas.draw({
        showCastingLines: true,
        showEdges: true,
        showIntersectionPoints: true
      });
    }, 1000 / this.fps);
  }
}
