interface IPoint {
  x: number;
  y: number;
}

class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

function draw(point: IPoint): void {}

const p1: IPoint = { x: 5, y: 3 };
const p2: Point = { x: 6, y: 2 };

console.log(p1, p2);

// no compilation errors
draw(p1);
draw(p2);
