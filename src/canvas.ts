
class Canvas {
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
    const context = this.element.getContext('2d');

    for (let i = 0; i < this.height; i += this.scale.y) {
      for (let j = 0; j < this.width; j += this.scale.x) {
        if (this.map.get(Math.floor(i / this.scale.x), Math.floor(j / this.scale.y))) {
          context.fillStyle = "#0000ff";
          context.fillRect(j, i, this.scale.x, this.scale.y);
        }
      }
    }
  }
}