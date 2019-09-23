interface Quantifier {
  zero: string;
  one: string;
  many: string;
}
class Quantified<T> {
  constructor(
    private value: T,
    private quantified: {
      [key in keyof Quantifier]: Quantifier[key]
    },
  ) {}

  toQuantity(quantity: keyof Quantifier): string {
    return this.quantified[quantity];
  }
}

const myText = new Quantified<string>(
  'person',
  {
    zero: 'nobody',
    one: 'person',
    many: 'people'
  }
);

myText.toQuantity('zero');
// TS2345: Argument of type '42' is not assignable to parameter of type '"zero" | "one" | "many"'.
myText.toQuantity(42);
