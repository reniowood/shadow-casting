import { Ray, Segment, Point } from './common';

interface Cell {
  filled: boolean;
  up?: Segment;
  down?: Segment;
  left?: Segment;
  right?: Segment;
}

export default class Map {
  private readonly map: Cell[][];
  readonly size: number;
  edges: Segment[];
  points: Point[];

  constructor(size: number) {
    this.size = size;
    this.map = this.createMap(size);
    this.edges = [];
    this.points = [];
  }

  isFilled(y: number, x: number): boolean {
    return this.map[y][x].filled;
  }

  toggle(y: number, x: number) {
    const Y = Math.floor(y);
    const X = Math.floor(x);
    this.map[Y][X].filled = !this.map[Y][X].filled;

    this.updateEdges();
    this.updatePoints();
  }

  private updateEdges() {
    this.edges = [];

    for (let y = 0; y < this.size; y += 1) {
      for (let x = 0; x < this.size; x += 1) {
        this.map[y][x] = {
          filled: this.map[y][x].filled,
        };

        if (this.map[y][x].filled) {
          this.checkTopCell(y, x);
          this.checkBottomCell(y, x);
          this.checkLeftCell(y, x);
          this.checkRightCell(y, x);
        }
      }
    }
  }

  private updatePoints() {
    this.points = [];

    for (const edge of this.edges) {
      this.points.push(edge.from);
      this.points.push(edge.to);
    }
  }

  getCastingPoints(p: Point) {
    const castingPoints = this.getCastingPointsFrom(p);
    this.sortCastingPointsCounterClockwiseBasedOn(p, castingPoints);
    return castingPoints;
  }

  private getCastingPointsFrom(p: Point) {
    const castingPoints = [];
    for (const point of this.points) {
      const ray = new Ray(p, point);
      const intersectionPoint = ray.getNearestIntersectionPointFromOrigin(this.edges);
      if (intersectionPoint) {
        castingPoints.push(intersectionPoint);
      }
    }
    return castingPoints;
  }

  private sortCastingPointsCounterClockwiseBasedOn(p: Point, castingPoints: Point[]) {
    castingPoints.sort((p1, p2) => {
      return p.getDegreeBetween(p1) - p.getDegreeBetween(p2);
    });
  }

  private checkTopCell(y: number, x: number) {
    if (y - 1 >= 0 && !this.map[y - 1][x].filled) {
      if (x - 1 >= 0 && this.map[y][x - 1].up) {
        const edge = this.map[y][x - 1].up;
        edge.to.x += 1;
        this.map[y][x].up = edge;
      } else {
        const edge = new Segment(new Point(x, y), new Point(x + 1, y));
        this.map[y][x].up = edge;
        this.edges.push(edge);
      }
    }
  }

  private checkBottomCell(y: number, x: number) {
    if (y + 1 < this.size && !this.map[y + 1][x].filled) {
      if (x - 1 >= 0 && this.map[y][x - 1].down) {
        const edge = this.map[y][x - 1].down;
        edge.to.x += 1;
        this.map[y][x].down = edge;
      } else {
        const edge = new Segment(new Point(x, y + 1), new Point(x + 1, y + 1));
        this.map[y][x].down = edge;
        this.edges.push(edge);
      }
    }
  }

  private checkLeftCell(y: number, x: number) {
    if (x - 1 >= 0 && !this.map[y][x - 1].filled) {
      if (y - 1 >= 0 && this.map[y - 1][x].left) {
        const edge = this.map[y - 1][x].left;
        edge.to.y += 1;
        this.map[y][x].left = edge;
      } else {
        const edge = new Segment(new Point(x, y), new Point(x, y + 1));
        this.map[y][x].left = edge;
        this.edges.push(edge);
      }
    }
  }

  private checkRightCell(y: number, x: number) {
    if (x + 1 < this.size && !this.map[y][x + 1].filled) {
      if (y - 1 >= 0 && this.map[y - 1][x].right) {
        const edge = this.map[y - 1][x].right;
        edge.to.y += 1;
        this.map[y][x].right = edge;
      } else {
        const edge = new Segment(new Point(x + 1, y), new Point(x + 1, y + 1));
        this.map[y][x].right = edge;
        this.edges.push(edge);
      }
    }
  }

  private createMap(size: number): Cell[][] {
    const map: Cell[][] = [];

    for (let i = 0; i < size; i += 1) {
      const row: Cell[] = [];

      for (let j = 0; j < size; j += 1) {
        row.push({ filled: i === 0 || j === 0 || i === size - 1 || j === size - 1 });
      }

      map.push(row);
    }

    return map;
  }
}