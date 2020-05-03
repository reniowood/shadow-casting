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
    this.drawCastingShadow();
    this.drawCastingLines();
  }

  private clearCanvas() {
    const context = this.element.getContext('2d');

    context.fillStyle = 'black';
    context.fillRect(0, 0, this.size, this.size);
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
      for (const point of this.map.points) {
        this.drawCastingLine(this.cursorPosition, point);
      }
    }
  }

  private drawCastingLine(from: Point, to: Point) {
    this.drawLine(new Line(from, to), "yellow");
  }

  private drawCastingShadow() {
    if (this.cursorPosition) {
      const castingPoints = this.map.getCastingPoints(this.cursorPosition);
      this.drawShape(castingPoints);
      for (const point of castingPoints) {
        this.drawIntersectionPoint(point);
      }
    }
  }

  private drawIntersectionPoint(point: Point) {
    this.drawPoint(point, this.scale / 8, "green");
  }

  private drawPoint(p: Point, r: number, color: string = "red") {
    const context = this.element.getContext('2d');

    context.beginPath();
    context.arc(p.x * this.scale, p.y * this.scale, r, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
    context.stroke();
  }

  private drawLine(line: Line, color: string = "white") {
    const context = this.element.getContext('2d');

    context.beginPath();
    context.moveTo(line.from.x * this.scale, line.from.y * this.scale);
    context.lineTo(line.to.x * this.scale, line.to.y * this.scale);
    context.strokeStyle = color;
    context.stroke();
  }

  private drawShape(points: Point[]) {
    const context = this.element.getContext('2d');

    if (points.length > 0) {
      context.beginPath();
      const count = points.length;
      context.moveTo(points[0].x * this.scale, points[0].y * this.scale);
      for (let i = 1; i <= count; i += 1) {
        context.lineTo(points[i % count].x * this.scale, points[i % count].y * this.scale);
      }
      context.closePath();
      context.fillStyle = "white";
      context.fill();
    }
  }
}