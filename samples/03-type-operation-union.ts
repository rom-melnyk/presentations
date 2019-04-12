type Dog = { bark: () => string; };
type Cat = { purr: () => string; };

function adopt(pet: Dog | Cat): void {}

// No compilation errors:
adopt({ bark: () => 'Woff!' });
adopt({ purr: () => 'Meow!' });
