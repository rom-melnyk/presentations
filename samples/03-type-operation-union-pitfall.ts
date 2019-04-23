type Dog = { bark: () => string; };
type Cat = { purr: () => string; };
type MyPet = { name: string } & (Dog | Cat);

const dog: MyPet = { bark: () => 'Woff!', name: 'Good boy', };
const cat: MyPet = { purr: () => 'Meow!', name: 'Lucky', };

function getMyPet(name: string): (MyPet | null) {
  return [dog, cat].find((myPet: MyPet) => myPet.name === name) || null;
}

const pet = getMyPet('Lucky');

// Following causes 2 errors:
//   Object is possibly 'null'
//   Property 'purr' does not exist on type 'MyPet'. Property 'purr' does not exist on type '{ name: string; } & Dog'
pet.purr();

// Following works:
(pet as Cat).purr();
