import { GRID_CELL_COUNT, cloneGrid, getRelatedCellKeys } from './grid.js';

let loopCount = 0;
const MAX_RECURSION_STEPS = 200000;

const getCellValue = (
  grid,
  key,
  considerSolved = true,
  considerInput = true
) => {
  if (grid.given[key] && grid.values[key] > 0) {
    return grid.values[key];
  }
  if (considerSolved && grid.solved[key] > 0) {
    return grid.solved[key];
  }
  if (considerInput && grid.values[key] > 0) {
    return grid.values[key];
  }
  return 0;
};

export const solveGrid = (grid, addToHistory = null, stepByStep = false) => {
  const nextGrid = cloneGrid(grid);

  if (!checkIfGridIsValid(grid)) {
    return [nextGrid, 'Grid is not valid'];
  }

  loopCount = 0;
  const isSolved = recursiveSolver(nextGrid, 0, addToHistory, stepByStep);
  const resultMessage = isSolved ? 'Success' : 'Error';
  return [nextGrid, resultMessage];
};

const recursiveSolver = (grid, key, addToHistory, stepByStep) => {
  loopCount++;
  if (loopCount > MAX_RECURSION_STEPS) {
    return false;
  }

  if (key >= GRID_CELL_COUNT) {
    return true;
  }

  if (getCellValue(grid, key, true, true) > 0) {
    return recursiveSolver(grid, key + 1, addToHistory, stepByStep);
  }

  const possibleValues = getPossibleValuesForCell(grid, key);
  for (let i = 0; i < possibleValues.length; i++) {
    const nextValue = possibleValues[i];
    setSolvedValueWithHistory(grid, key, nextValue, stepByStep, addToHistory);
    if (recursiveSolver(grid, key + 1, addToHistory, stepByStep)) {
      return true;
    }
  }

  setSolvedValueWithHistory(grid, key, 0, stepByStep, addToHistory);
  return false;
};

export const checkIfGridIsValid = (grid) => {
  for (let key = 0; key < GRID_CELL_COUNT; key++) {
    const possibleValues = getPossibleValuesForCell(grid, key, true);
    const cellValue = getCellValue(grid, key, true, true);
    if (cellValue > 0 && possibleValues.indexOf(cellValue) === -1) {
      return false;
    }
  }

  return true;
};

const setSolvedValueWithHistory = (
  grid,
  key,
  value,
  stepByStep,
  addToHistory
) => {
  grid.solved[key] = value;
  if (stepByStep && value > 0 && addToHistory) {
    addToHistory({ key, solvedValue: value });
  }
};

export const getPossibleValuesForCell = (
  grid,
  cellKey,
  considerInputValues = true
) => {
  const valuesAvailability = new Array(9).fill(1);
  const keysInRange = new Set(getRelatedCellKeys(cellKey));
  keysInRange.delete(cellKey);

  keysInRange.forEach((key) => {
    const cellValue = getCellValue(grid, key, true, considerInputValues);
    if (cellValue > 0) {
      valuesAvailability[cellValue - 1] = 0;
    }
  });

  const possibleValues = [];
  valuesAvailability.forEach((isAvailable, index) => {
    if (isAvailable) {
      possibleValues.push(index + 1);
    }
  });

  return possibleValues;
};
