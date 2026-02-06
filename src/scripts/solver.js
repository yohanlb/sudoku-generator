import * as GridFunc from './gridFunctions.js';

let loopCount;
const maxLoop = 300;

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
  let nextGrid = GridFunc.cloneGrid(grid);
  let isSolved = false;

  if (!checkIfGridIsValid(grid)) {
    console.log('grid not valid');
  }

  let attempts = 0;

  while (!isSolved && attempts < 50) {
    loopCount = 0;
    attempts++;
    nextGrid = GridFunc.cloneGrid(grid);
    isSolved = recursiveSolver(nextGrid, 0, addToHistory, stepByStep);
  }
  console.log(
    'loop count : ',
    loopCount,
    'attempts : ',
    attempts,
    'solved : ',
    isSolved
  );

  if (!isSolved) {
    GridFunc.saveGrid(nextGrid);
  }
  const resultMessage = isSolved ? 'Success' : 'Error';
  return [nextGrid, resultMessage];
};

const recursiveSolver = (grid, key, addToHistory, stepByStep) => {
  loopCount++;
  if (loopCount > maxLoop) {
    return false;
  }
  if (!checkIfGridIsValid(grid)) {
    console.log('grid not valid');
  }
  if (loopCount > maxLoop + 100)
    throw new Error('Error while solving the grid');
  const useInputValues = true;

  if (key >= GridFunc.GRID_CELL_COUNT) {
    return true;
  } //Solving finished

  const cellValue = getCellValue(grid, key, true, useInputValues) > 0;

  // this cell is already solved, go to next cell
  if (cellValue) {
    return recursiveSolver(grid, key + 1, addToHistory, stepByStep);
  }

  const possibleValues = getPossibleValuesForCell(grid, key);
  const shuffledValues = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let i = 1; i <= 9; i++) {
    if (possibleValues.some((value) => value === shuffledValues[i - 1])) {
      setSolvedValueWithHistory(
        grid,
        key,
        shuffledValues[i - 1],
        stepByStep,
        addToHistory
      );

      // try to resolve the rest of the array with this value for the current cell
      if (recursiveSolver(grid, key + 1, addToHistory, stepByStep)) return true;
    }
  }

  setSolvedValueWithHistory(grid, key, 0, stepByStep, addToHistory);

  return false; // this grid is not solvable, going back to previous recursion.
};

export const checkIfGridIsValid = (grid) => {
  let isValid = true;
  for (let key = 0; key < GridFunc.GRID_CELL_COUNT; key++) {
    const possibleValues = getPossibleValuesForCell(grid, key, true);
    const cellValue = getCellValue(grid, key, true, true);
    if (cellValue > 0 && possibleValues.indexOf(cellValue) === -1) {
      // if there is more than one cell with the same value
      console.log('Wrong grid values for cell : ', key);
      isValid = false;
    }
  }

  return isValid;
};

//**********************   Utilities  **************************************/

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

  // get all keys in range for the selected cell
  const keysInRange = new Set([
    ...GridFunc.returnSquareKeys(cellKey),
    ...GridFunc.returnEntireRowKeys(grid, cellKey),
    ...GridFunc.returnEntireColKeys(grid, cellKey),
  ]);
  keysInRange.delete(cellKey);

  //find which values are already used among all the cells in range
  keysInRange.forEach((key) => {
    const cellValue = getCellValue(grid, key, true, considerInputValues);
    if (cellValue > 0) {
      valuesAvailability[cellValue - 1] = 0;
    }
  });

  // create an array with only the available values
  const possibleValues = [];
  valuesAvailability.forEach((el, i) => {
    if (el) {
      possibleValues.push(i + 1);
    }
    //index goes from 0 to 8, but we want to return 1 to 9
  });

  return possibleValues;
};
