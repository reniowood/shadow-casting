import Map from './map';

export default class Canvas {
  private readonly element: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  private readonly map: Map;
  private readonly scale: { x: number, y: number };

  constructor(width: number, height: number, map: Map) {
    this.width = width;
    this.height = height;
    this.element = this.createCanvasElement(width, height);
    document.getElementById('main').appendChild(this.element);
    this.element.onclick = (event) => {
      console.log(`clicked: (${event.offsetX}, ${event.offsetY})`);
      map.toggle(Math.floor(event.offsetY / 16), Math.floor(event.offsetX / 16));
      map.updateEdges();
    };
    this.map = map;
    this.scale = {
      x: this.width / map.width,
      y: this.height / map.height,
    };
  }

  private createCanvasElement(width: number, height: number): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;
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

    context.clearRect(0, 0, this.width, this.height);
  }

  private drawCell() {
    const context = this.element.getContext('2d');

    for (let i = 0; i < this.height; i += this.scale.y) {
      for (let j = 0; j < this.width; j += this.scale.x) {
        if (this.map.isFilled(Math.floor(i / this.scale.x), Math.floor(j / this.scale.y))) {
          context.fillStyle = "#0000ff";
          context.fillRect(j, i, this.scale.x, this.scale.y);
        }
      }
    }
  }

  private drawEdges() {
    this.map.edges.forEach((edge) => {
      const radius = Math.min(this.scale.x, this.scale.y) / 4;
      const x1 = edge.x1 * this.scale.x;
      const y1 = edge.y1 * this.scale.y;
      const x2 = edge.x2 * this.scale.x;
      const y2 = edge.y2 * this.scale.y;

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