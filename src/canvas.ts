import Map from './map';

export default class Canvas {
  private readonly element: HTMLCanvasElement;
  readonly size: number;
  private readonly map: Map;
  private readonly scale: number;

  constructor(size: number, map: Map) {
    this.size = size;
    this.element = this.createCanvasElement(size);
    document.getElementById('main').appendChild(this.element);
    this.element.onclick = (event) => {
      console.log(`clicked: (${event.offsetX}, ${event.offsetY})`);
      map.toggle(Math.floor(event.offsetY / 16), Math.floor(event.offsetX / 16));
      map.updateEdges();
    };
    this.map = map;
    this.scale = this.size / map.size;
  }

  private createCanvasElement(size: number): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.width = size;
    canvas.height = size;
    canvas.setAttribute('style', 'border: 1px solid;');

    return canvas;
  }

  draw() {
    this.clearCanvas();
    this.drawCell();
    this.drawEdges();
  }

  private clearCanvas() {
    const context = this.element.getContext('2d');

    context.clearRect(0, 0, this.size, this.size);
  }

  private drawCell() {
    const context = this.element.getContext('2d');

    for (let i = 0; i < this.size; i += this.scale) {
      for (let j = 0; j < this.size; j += this.scale) {
        if (this.map.isFilled(Math.floor(i / this.scale), Math.floor(j / this.scale))) {
          context.fillStyle = "#0000ff";
          context.fillRect(j, i, this.scale, this.scale);
        }
      }
    }
  }

  private drawEdges() {
    this.map.edges.forEach((edge) => {
      const radius = this.scale / 4;
      const x1 = edge.x1 * this.scale;
      const y1 = edge.y1 * this.scale;
      const x2 = edge.x2 * this.scale;
      const y2 = edge.y2 * this.scale;

      this.drawPoint(x1, y1, radius);
      this.drawLine(x1, y1, x2, y2);
      this.drawPoint(x2, y2, radius);
    });
  }

  private drawPoint(x: number, y: number, r: number) {
    const context = this.element.getContext('2d');

    context.beginPath();
    context.arc(x, y, r, 0, 2 * Math.PI);
    context.fillStyle = "#ff0000";
    context.fill();
    context.stroke();
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number) {
    const context = this.element.getContext('2d');

    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }
}