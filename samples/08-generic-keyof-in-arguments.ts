type PartiallyQuantified<T, K extends keyof Quantifier> = {
  value: T;
} & {
  [key in K]: Quantifier[key];
};

const onePerson: PartiallyQuantified<string, 'one'> = { value: 'me', one: 'person' };
const manyPeople: PartiallyQuantified<string, 'many'> = { value: 'crowd', many: 'people' };

// TS2344: Type '"some"' does not satisfy the constraint '"zero" | "one" | "many"'.
let somePeople: PartiallyQuantified<string, 'some'>;
