const passwordKey = Symbol();
interface Mi6Agent {
  name: string;
  [passwordKey]: string;  // referring explicitly to `passwordKey`
}

const real007: Mi6Agent = {
  name: 'James Bond',
  [passwordKey]: 'Shaken, not stirred',
};

// Because of Symbols are unique/different,
// TS2741: Property '[passwordKey]' is missing in type '...'.
const fakeAgent: Mi6Agent = {
  name: 'James Bond Wannabe',
  [Symbol()]: 'Whiskey-Cola', // this is not `passwordKey`
};
