enum Positions {
  HR = 'hr',
  Manager = 'manager',
}

interface Person {
  name: string;
  position: Positions;
  merits: {
    projectsSucceeded?: number;
    teamsCreated?: number;
  };
}

const pos1: Person['position'] = Positions.HR; // same as `pos1: Positions = ...;`
const merit1: Person['merits'] = {/* projectsSucceeded, teamsCreated */};
