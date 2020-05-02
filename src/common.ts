export class Line {
  from: Point;
  to: Point;

  constructor(from: Point, to: Point) {
    this.from = from;
    this.to = to;
  }

  hasPoint(p: Point) {
    return this.from.equals(p) || this.to.equals(p);
  }

  get slope(): number | undefined {
    if (!this.isVertical) {
      return (this.to.y - this.from.y) / (this.to.x - this.from.x);
    }
  }

  get yIntercept(): number | undefined {
    if (!this.isVertical) {
      return -(this.from.x * this.to.y - this.to.x * this.from.y) / (this.to.x - this.from.x);
    }
  }

  get minX() {
    return Math.min(this.from.x, this.to.x);
  }

  get maxX() {
    return Math.max(this.from.x, this.to.x);
  }

  get minY() {
    return Math.min(this.from.y, this.to.y);
  }

  get maxY() {
    return Math.max(this.from.y, this.to.y);
  }

  get isVertical() {
    return this.from.x === this.to.x;
  }

  intersect(line: Line): boolean {
    if (this.isVertical && line.isVertical) {
      return this.minX === line.minX && line.maxY >= this.minY && this.maxY >= line.minY;
    } else if (this.isVertical) {
      const x = this.from.x;
      const y = line.slope * x + line.yIntercept;

      return line.minX <= x && x <= line.maxX && this.minY <= y && y <= this.maxY;
    } else if (line.isVertical) {
      const x = line.from.x;
      const y = this.slope * x + this.yIntercept;

      return this.minX <= x && x <= this.maxX && line.minY <= y && y <= line.maxY;
    } else {
      if (this.slope === line.slope) {
        return this.yIntercept === line.yIntercept;
      }

      const x = -(this.yIntercept - line.yIntercept) / (this.slope - line.slope);

      return this.minX <= x && x <= this.maxX &&
        line.minX <= x && x <= line.maxX;
    }
  }
}

export class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(p: Point) {
    return this.x === p.x && this.y === p.y;
  }
}