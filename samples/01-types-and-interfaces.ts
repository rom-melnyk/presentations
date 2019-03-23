interface IPoint {
  x: number;
  y: number;
}

type TPoint = {
  x: number;
  y: number;
};

const p1: IPoint = { x: 5, y: 3 };
const p2: TPoint = { x: 6, y: 2 };

console.log(p1, p2);
