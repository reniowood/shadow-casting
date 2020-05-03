export class Line {
  readonly from: Point;
  readonly to: Point;

  constructor(from: Point, to: Point) {
    this.from = from;
    this.to = to;
  }

  protected get slope(): number | undefined {
    if (!this.isVertical) {
      return (this.to.y - this.from.y) / (this.to.x - this.from.x);
    }
  }

  protected get yIntercept(): number | undefined {
    if (!this.isVertical) {
      return -(this.from.x * this.to.y - this.to.x * this.from.y) / (this.to.x - this.from.x);
    }
  }

  protected get minX() {
    return Math.min(this.from.x, this.to.x);
  }

  protected get maxX() {
    return Math.max(this.from.x, this.to.x);
  }

  protected get minY() {
    return Math.min(this.from.y, this.to.y);
  }

  protected get maxY() {
    return Math.max(this.from.y, this.to.y);
  }

  protected get isVertical() {
    return this.from.x === this.to.x;
  }

  protected isDefinedAt(p: Point): boolean {
    return true;
  }

  private intersect(line: Line): boolean {
    if (this.isVertical && line.isVertical) {
      return this.minX === line.minX;
    } else if (this.isVertical) {
      return true;
    } else if (line.isVertical) {
      return true;
    } else if (this.slope === line.slope) {
      return this.yIntercept === line.yIntercept;
    } else {
      return true;
    }
  }

  getIntersectionPoint(line: Line): Point | undefined {
    if (!this.intersect(line)) {
      return undefined;
    }

    let x, y;
    if (this.isVertical && line.isVertical) {
      x = this.minX;
      y = line.minY;
    } else if (this.isVertical) {
      x = this.minX;
      y = line.slope * x + line.yIntercept;
    } else if (line.isVertical) {
      x = line.minX;
      y = this.slope * x + this.yIntercept;
    } else if (this.slope === line.slope) {
      x = line.minX;
      y = line.minY;
    } else {
      x = -(this.yIntercept - line.yIntercept) / (this.slope - line.slope);
      y = this.slope * x + this.yIntercept;
    }
    const intersectionPoint = new Point(x, y);
    return this.isDefinedAt(intersectionPoint) && line.isDefinedAt(intersectionPoint) && intersectionPoint;
  }
}

export class Segment extends Line {
  isDefinedAt(p: Point): boolean {
    if (p.x < this.minX || this.maxX < p.x) {
      return false;
    }

    if (this.isVertical) {
      return this.minY <= p.y && p.y <= this.maxY;
    }

    const y = this.slope * p.x + this.yIntercept;
    return this.minY <= y && y <= this.maxY;
  }
}

export class Ray extends Line {
  isDefinedAt(p: Point): boolean {
    if (!this.isDefinedAtX(p.x)) {
      return false;
    }

    if (this.isVertical) {
      return this.minY <= p.y && p.y <= this.maxY;
    }

    const y = this.slope * p.x + this.yIntercept;
    return this.isDefinedAtY(y);
  }

  private isDefinedAtX(x: number) {
    if (this.from.x <= this.to.x) {
      return x >= this.from.x;
    } else {
      return x <= this.from.x;
    }
  }

  private isDefinedAtY(y: number) {
    if (this.from.y <= this.to.y) {
      return y >= this.from.y;
    } else {
      return y <= this.from.y;
    }
  }

  getNearestIntersectionPointFromOrigin(lines: Line[]): Point | undefined {
    const intersectionPoints: Point[] = [];
    for (const line of lines) {
      const intersectionPoint = this.getIntersectionPoint(line);
      if (intersectionPoint) {
        intersectionPoints.push(intersectionPoint);
      }
    }
    intersectionPoints.sort((p1, p2) => this.from.getDistance(p1) - this.from.getDistance(p2));
    return intersectionPoints[0];
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

  getDistance(p: Point): number {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }

  getDegreeBetween(p: Point): number {
    const degree = Math.acos((p.x - this.x) / this.getDistance(p));
    return p.y < this.y ? 2 * Math.PI - degree : degree;
  }

  rotateAround(center: Point, degree: number): Point {
    const X = Math.cos(degree) * (this.x - center.x) - Math.sin(degree) * (this.y - center.y);
    const Y = Math.sin(degree) * (this.x - center.x) + Math.cos(degree) * (this.y - center.y);

    return new Point(X + center.x, Y + center.y);
  }
}