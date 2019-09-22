type PositionsList = 'hr' | 'manager';
let positionViaList: PositionsList = 'hr'; // only 'hr' or 'manager'

// Using as method parameter
function forPositionViaList(position: PositionsList): void {
  // realization
}
forPositionViaList('manager');

// Using as type/interface key
type EmployeeCountViaList = {
  [key in PositionsList]: number;
};
const countViaList: EmployeeCountViaList = { hr: 5, manager: 10 };
