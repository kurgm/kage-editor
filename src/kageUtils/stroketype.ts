export const strokeTypes = [1, 2, 3, 4, 6, 7];

export const headShapeTypes: Record<number, number[]> = {
  1: [0, 2, 32, 12, 22],
  2: [0, 32, 12, 22, 7],
  3: [0, 32, 12, 22],
  4: [0, 22],
  6: [0, 32, 12, 22, 7],
  7: [0, 32, 12, 22],
};

export const tailShapeTypes: Record<number, number[]> = {
  1: [0, 2, 32, 13, 23, 4, 313, 413, 24],
  2: [7, 0, 8, 4, 5],
  3: [0, 5],
  4: [0, 5],
  6: [7, 0, 8, 4, 5],
  7: [7],
};
