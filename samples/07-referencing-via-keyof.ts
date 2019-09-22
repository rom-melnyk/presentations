interface PositionsMap {
  hr: any;
  manager: any;
}
let positionViaMap: keyof PositionsMap = 'hr';

// Using as method parameter
function forPositionViaMap(position: keyof PositionsMap): void {
  // realization
}
forPositionViaMap('manager');

// Using as type/interface key
type EmployeeCountViaMap = {
  [key in keyof PositionsMap]: number;
};
const countViaMap: EmployeeCountViaMap = { hr: 3, manager: 2 };
