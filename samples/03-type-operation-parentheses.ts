type Dog = { bark: () => string; };
type Cat = { purr: () => string; };

type MyPet = {
  eat: (food: any) => void
} & (
  Cat | Dog
);

function adopt(pet: MyPet): void {}

// Next line works fine
adopt({ eat: () => {}, bark: () => 'Woff!' });

// TS2345: Argument of type '{ purr: () => string; }' is not assignable to parameter of type 'MyPet'... Property 'eat' is missing...
adopt({ purr: () => 'Meow!' });
