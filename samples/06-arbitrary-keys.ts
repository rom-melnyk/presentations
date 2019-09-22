interface Loose {
  mandatory: number;
  [key: string]: number;
}

const obj: Loose = { mandatory: 42, x: 8, y: -1 };

const numObj1: { [key: number]: boolean } = { 1: false };
const numObj2: { [key: number]: boolean } = { '1': false }; // number-as-string works as well

const numObjX: { [key: number]: boolean } = { a: false }; // TS2322: Type '...' is not assignable to type '...'.

const numObjS: { [key: string]: boolean } = { 1: false }; // numeric key is casted to string
