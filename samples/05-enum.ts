enum Positions {
  HR = 'hr',
  Manager = 'manager',
}

interface Person {
  name: string;
  position: Positions;
}

const p1: Person = { name: 'John', position: Positions.HR };
const p2: Person = { name: 'Jack', position: 'manager' }; // TS2322: Type '"manager"' is not assignable to type 'Positions'.
