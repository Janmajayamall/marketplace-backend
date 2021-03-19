export function roundToTwoPlaces(value: number): number {
  return +value.toFixed(2);
}

export function convertToInt(value: number): number {
  return Math.round(value);
}

export function sanitizeProductTags(tags: string[]) {
  return tags.map((tag) => {
    return tag.trim().toLowerCase();
  });
}

export enum DataEntityStatus {
  DELETED = 'deleted',
  ACTIVE = 'active',
}
