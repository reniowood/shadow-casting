export default class Map {
  private readonly map: boolean[][];
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.map = this.createMap(width, height);
  }

  private createMap(width: number, height: number): boolean[][] {
    const map: boolean[][] = [];

    for (let i = 0; i < height; i += 1) {
      const row = [];

      for (let j = 0; j < width; j += 1) {
        row.push(false);
      }

      map.push(row);
    }

    return map;
  }

  get(y: number, x: number): boolean {
    return this.map[y][x];
  }

  toggle(y: number, x: number) {
    this.map[y][x] = !this.map[y][x];
  }
}