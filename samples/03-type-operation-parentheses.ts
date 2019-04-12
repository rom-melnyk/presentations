type Dog = { bark: () => string; };
type Cat = { purr: () => string; };

type MyPet = { name: string } & (Cat | Dog);

function adopt(pet: MyPet): void {}

// Next line works fine
adopt({ name: 'Good boy', bark: () => 'Woff!' });

// TS2345: Argument of type '{ purr: () => string; }' is not assignable to parameter of type 'MyPet'... Property 'name' is missing...
adopt({ purr: () => 'Meow!' });
