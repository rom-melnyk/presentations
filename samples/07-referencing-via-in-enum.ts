enum PositionsEnum {
  HR = 'hr',
  Manager = 'manager',
}

// Using as method parameter
function forPositionViaEnum(position: PositionsEnum): void {
  // realization
}
forPositionViaEnum(PositionsEnum.HR);

// Using as type/interface key
type EmployeeCountViaEnum = {
  [key in PositionsEnum]: number;
};
const countViaEnum: EmployeeCountViaEnum = { hr: 3, [PositionsEnum.Manager]: 2 };
