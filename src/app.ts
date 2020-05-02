import Map from './map';
import Canvas from './canvas';

export default class App {
  private readonly map: Map;
  private readonly canvas: Canvas;
  private readonly fps: number;

  constructor(width: number, height: number, scale: number, fps: number) {
    this.map = new Map(width / scale, height / scale);
    this.canvas = new Canvas(width, height, this.map);
    this.fps = fps;
  }

  run() {
    setInterval(() => {
      this.canvas.draw();
    }, 1000 / this.fps);
  }
}
