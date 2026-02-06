import test from 'node:test';
import assert from 'node:assert/strict';

import { createEmptyGrid } from './grid.js';
import {
  checkIfGridIsValid,
  getPossibleValuesForCell,
  solveGrid,
} from './solver.js';

const seedGrid = (values) => {
  const grid = createEmptyGrid();
  values.forEach((value, key) => {
    if (value > 0) {
      grid.values[key] = value;
      grid.given[key] = true;
    }
  });
  return grid;
};

test('solver solves a valid puzzle with plain grid data', () => {
  const puzzle = [
    5, 3, 0, 0, 7, 0, 0, 0, 0, 6, 0, 0, 1, 9, 5, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0,
    6, 0, 8, 0, 0, 0, 6, 0, 0, 0, 3, 4, 0, 0, 8, 0, 3, 0, 0, 1, 7, 0, 0, 0, 2,
    0, 0, 0, 6, 0, 6, 0, 0, 0, 0, 2, 8, 0, 0, 0, 0, 4, 1, 9, 0, 0, 5, 0, 0, 0,
    0, 8, 0, 0, 7, 9,
  ];

  const grid = seedGrid(puzzle);
  assert.equal(checkIfGridIsValid(grid), true);

  const [solvedGrid, resultMessage] = solveGrid(grid);
  assert.equal(resultMessage, 'Success');
  assert.equal(checkIfGridIsValid(solvedGrid), true);

  const unsolvedCount = solvedGrid.values.reduce((count, _, key) => {
    const finalValue = solvedGrid.given[key]
      ? solvedGrid.values[key]
      : solvedGrid.solved[key] || solvedGrid.values[key];
    return finalValue === 0 ? count + 1 : count;
  }, 0);
  assert.equal(unsolvedCount, 0);
});

test('possible values are computed from plain grid data', () => {
  const grid = seedGrid([
    5, 3, 0, 0, 7, 0, 0, 0, 0, 6, 0, 0, 1, 9, 5, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0,
    6, 0, 8, 0, 0, 0, 6, 0, 0, 0, 3, 4, 0, 0, 8, 0, 3, 0, 0, 1, 7, 0, 0, 0, 2,
    0, 0, 0, 6, 0, 6, 0, 0, 0, 0, 2, 8, 0, 0, 0, 0, 4, 1, 9, 0, 0, 5, 0, 0, 0,
    0, 8, 0, 0, 7, 9,
  ]);

  const possibleValues = getPossibleValuesForCell(grid, 2);
  assert.deepEqual(possibleValues, [1, 2, 4]);
});
