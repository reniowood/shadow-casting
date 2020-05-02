interface Cell {
  filled: boolean;
  up?: Edge;
  down?: Edge;
  left?: Edge;
  right?: Edge;
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export default class Map {
  private readonly map: Cell[][];
  edges: Edge[];
  readonly size: number;

  constructor(size: number) {
    this.size = size;
    this.map = this.createMap(size);
    this.edges = [];
  }

  isFilled(y: number, x: number): boolean {
    return this.map[y][x].filled;
  }

  toggle(y: number, x: number) {
    this.map[y][x].filled = !this.map[y][x].filled;
  }

  updateEdges() {
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

  private checkTopCell(y: number, x: number) {
    if (y - 1 >= 0 && !this.map[y - 1][x].filled) {
      if (x - 1 >= 0 && this.map[y][x - 1].up) {
        const edge = this.map[y][x - 1].up;
        edge.x2 += 1;
        this.map[y][x].up = edge;
      } else {
        const edge: Edge = {
          x1: x,
          y1: y,
          x2: x + 1,
          y2: y
        };
        this.map[y][x].up = edge;
        this.edges.push(edge);
      }
    }
  }

  private checkBottomCell(y: number, x: number) {
    if (y + 1 < this.size && !this.map[y + 1][x].filled) {
      if (x - 1 >= 0 && this.map[y][x - 1].down) {
        const edge = this.map[y][x - 1].down;
        edge.x2 += 1;
        this.map[y][x].down = edge;
      } else {
        const edge: Edge = {
          x1: x,
          y1: y + 1,
          x2: x + 1,
          y2: y + 1
        };
        this.map[y][x].down = edge;
        this.edges.push(edge);
      }
    }
  }

  private checkLeftCell(y: number, x: number) {
    if (x - 1 >= 0 && !this.map[y][x - 1].filled) {
      if (y - 1 >= 0 && this.map[y - 1][x].left) {
        const edge = this.map[y - 1][x].left;
        edge.y2 += 1;
        this.map[y][x].left = edge;
      } else {
        const edge: Edge = {
          x1: x,
          y1: y,
          x2: x,
          y2: y + 1
        };
        this.map[y][x].left = edge;
        this.edges.push(edge);
      }
    }
  }

  private checkRightCell(y: number, x: number) {
    if (x + 1 < this.size && !this.map[y][x + 1].filled) {
      if (y - 1 >= 0 && this.map[y - 1][x].right) {
        const edge = this.map[y - 1][x].right;
        edge.y2 += 1;
        this.map[y][x].right = edge;
      } else {
        const edge: Edge = {
          x1: x + 1,
          y1: y,
          x2: x + 1,
          y2: y + 1
        };
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
        row.push({ filled: false });
      }

      map.push(row);
    }

    return map;
  }
}