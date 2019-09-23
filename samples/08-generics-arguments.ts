/**
 * Several types names are prefixed with "Geo"- in order to avoid name collisions.
 */

type GeoPosition = number[]; // think "x, y" or "x, y, z"
interface GeoPoint {
  type: 'Point'; // "Point" as string constant must be used
  coordinates: GeoPosition;
}
interface LineString {
  type: 'LineString';
  coordinates: GeoPosition[]; // think `[ [x, y], [x, y],... ]`
}
type DirectGeometryObject = GeoPoint | LineString;

/**
 * @param G     Constrained to anything Point-ish or LineString-ish.
 * @param [P]   Optional.
 */
interface Feature<G extends DirectGeometryObject, P = any> {
  type: 'Feature';
  id?: string | number;
  geometry: G;
  properties?: P;
}

// Using both arguments
const point: Feature<GeoPoint, { type: 'star' | 'planet' }> = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [12345.67, 54321.09],
  },
  properties: {
    type: 'planet'
  }
};

// Using one argument
const pathAtoB: Feature<LineString> = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [[0, 0], [100, 200]]
  }
  // `properties: { /* anything */ }` works as well
};
