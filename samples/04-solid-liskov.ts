type Dog = { bark: () => string; };
type Cat = { purr: () => string; };
type MyPet = { name: string } & (Dog | Cat);

const dog: MyPet = { bark: () => 'Woff!', name: 'Good boy', };

function adopt(pet: Dog | Cat): void {}

adopt(dog); // works fine
