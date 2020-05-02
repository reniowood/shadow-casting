import Map from './map';
import { Line, Point } from './common';

export default class Canvas {
  private readonly element: HTMLCanvasElement;
  readonly size: number;
  private readonly map: Map;
  private readonly scale: number;
  private cursorPosition?: Point;

  constructor(size: number, map: Map) {
    this.size = size;
    this.map = map;
    this.element = this.createCanvasElement(size);
    this.addOnClickHandler();
    this.addOnMouseOverHandler();
    this.addOnMouseOutHandler();
    this.scale = this.size / map.size;
  }

  private createCanvasElement(size: number): HTMLCanvasElement {
    const canvas: HTMLCanvasElement = document.createElement('canvas');

    canvas.width = size;
    canvas.height = size;
    canvas.setAttribute('style', 'border: 1px solid;');

    document.getElementById('main').appendChild(canvas);

    return canvas;
  }

  private addOnClickHandler() {
    this.element.onclick = (event) => {
      this.map.toggle(event.offsetY / this.scale, event.offsetX / this.scale);
      this.map.updateEdges();
    };
  }

  private addOnMouseOverHandler() {
    this.element.onmousemove = (event) => {
      this.cursorPosition = new Point(event.offsetX / this.scale, event.offsetY / this.scale);
    };
  }

  private addOnMouseOutHandler() {
    this.element.onmouseout = (event) => {
      this.cursorPosition = undefined;
    };
  }

  draw() {
    this.clearCanvas();
    this.drawCell();
    this.drawEdges();
    this.drawCastingLines();
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

      this.drawPoint(edge.from, radius);
      this.drawLine(edge);
      this.drawPoint(edge.to, radius);
    });
  }

  private drawCastingLines() {
    if (this.cursorPosition) {
      for (let point of this.map.points) {
        const castingLine = new Line(this.cursorPosition, point);
        if (!this.isLineCrossCell(castingLine)) {
          this.drawLine(castingLine);
        }
      }
    }
  }

  private isLineCrossCell(line: Line) {
    for (let edge of this.map.edges) {
      if (!edge.hasPoint(line.from) && !edge.hasPoint(line.to) && edge.intersect(line)) {
        return true;
      }
    }

    return false;
  }

  private drawPoint(p: Point, r: number) {
    const context = this.element.getContext('2d');

    context.beginPath();
    context.arc(p.x * this.scale, p.y * this.scale, r, 0, 2 * Math.PI);
    context.fillStyle = "#ff0000";
    context.fill();
    context.stroke();
  }

  private drawLine(line: Line) {
    const context = this.element.getContext('2d');

    context.beginPath();
    context.moveTo(line.from.x * this.scale, line.from.y * this.scale);
    context.lineTo(line.to.x * this.scale, line.to.y * this.scale);
    context.stroke();
  }
}