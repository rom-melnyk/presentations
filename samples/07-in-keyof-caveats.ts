type ExtraKeys = {
  // TS1170: A computed property name in a type literal must refer to an expression whose type is a literal type or a 'unique symbol' type`
  // three: null;
  [key in ('one' | 'two')]: number;
};

type MyTypeWithArbitraryExtraKeys = {
  one: number;
  two: number;
  [key: string]: number;
};

type MyTypeWithDefinedExtraKeys = {
  [key in ('one' | 'two')]: number;
} & {
  three: number;
  four: number;
};

// The same but using `interface` syntax
interface IMyTypeWithDefinedExtraKeys extends ExtraKeys {
  three: number;
  four: number;
}
