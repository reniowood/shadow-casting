import Map from './map';
import Canvas from './canvas';
import { OptionsPanel } from './optionsPanel';
import { AppOptions } from './appOptions';

export default class App {
  private readonly map: Map;
  private readonly fps: number;
  private readonly options: AppOptions;
  private readonly canvas: Canvas;
  private readonly optionsPanel: OptionsPanel;

  constructor(size: number, scale: number, fps: number) {
    this.map = new Map(size / scale);
    this.fps = fps;
    this.options = {
      showCastingLines: true,
      showEdges: true,
      showIntersectionPoints: true
    };
    this.optionsPanel = new OptionsPanel(this.options);
    this.canvas = new Canvas(size, this.map);
  }

  run() {
    setInterval(() => {
      this.canvas.draw(this.options);
    }, 1000 / this.fps);
  }
}
