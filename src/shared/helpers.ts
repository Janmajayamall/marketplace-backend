export function roundToTwoPlaces(value: number): number {
  return +value.toFixed(2);
}

export function convertToInt(value: number): number {
  return Math.round(value);
}

export enum DataEntityStatus {
  DELETED = 'deleted',
  ACTIVE = 'active',
}
