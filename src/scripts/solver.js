import * as GridFunc from './gridFunctions.js';

let loopCount;
const maxLoop = 300;

export const solveGrid = (cells, addToHistory = null, stepByStep = false) => {
  let newCells = GridFunc.cloneGrid(cells);
  let isSolved = false;

  if (!checkIfGridIsValid(cells)) {
    console.log('grid not valid');
  }

  let attempts = 0;

  while (!isSolved && attempts < 50) {
    loopCount = 0;
    attempts++;
    newCells = GridFunc.cloneGrid(cells);
    isSolved = recursiveSolver(newCells, 0, addToHistory, stepByStep);
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
    GridFunc.saveGrid(newCells);
  }
  const resultMessage = isSolved ? 'Success' : 'Error';
  return [newCells, resultMessage];
};

const recursiveSolver = (cells, key, addToHistory, stepByStep) => {
  loopCount++;
  if (loopCount > maxLoop) {
    return false;
  }
  if (!checkIfGridIsValid(cells)) {
    console.log('grid not valid');
  }
  if (loopCount > maxLoop + 100)
    throw new Error('Error while solving the grid');
  const useGuessedValues = true;

  if (key >= 9 * 9) {
    return true;
  } //Solving finished

  const currentCell = cells[key];
  const cellValue =
    currentCell.solvedValue > 0 ||
    currentCell.actualValue > 0 ||
    (useGuessedValues && currentCell.guessedValue > 0);

  // this cell is already solved, go to next cell
  if (cellValue) {
    return recursiveSolver(cells, key + 1, addToHistory, stepByStep);
  }

  const possibleValues = getPossibleValuesForCell(cells, currentCell);
  let shuffledValues = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let i = 1; i <= 9; i++) {
    if (possibleValues.some((value) => value === shuffledValues[i - 1])) {
      setSolvedValueWithHistory(
        currentCell,
        shuffledValues[i - 1],
        stepByStep,
        addToHistory
      );

      // try to resolve the rest of the array with this value for the current cell
      if (recursiveSolver(cells, key + 1, addToHistory, stepByStep))
        return true;
    }
  }

  setSolvedValueWithHistory(currentCell, 0, stepByStep, addToHistory);

  return false; // this grid is not solvable, going back to previous recursion.
};

export const checkIfGridIsValid = (cells) => {
  let isValid = true;
  cells.forEach((cell) => {
    const possibleValues = getPossibleValuesForCell(cells, cell, true);

    let cellValue = 0;
    if (cell.actualValue > 0) {
      cellValue = cell.actualValue;
    } else if (cell.solvedValue > 0) {
      cellValue = cell.solvedValue;
    } else if (cell.guessedValue > 0) {
      cellValue = cell.guessedValue;
    }
    if (cellValue > 0 && possibleValues.indexOf(cellValue) === -1) {
      // if there is more than one cell with the same value
      console.log('Wrong grid values for cell : ', cell.key);
      isValid = false;
    }
  });

  return isValid;
};

//**********************   Utilities  **************************************/

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const setSolvedValueWithHistory = (cell, value, stepByStep, addToHistory) => {
  cell.setSolvedValue(value);
  if (stepByStep && value > 0) {
    addToHistory({
      key: cell.key,
      solvedValue: value,
    });
  }
};

export const getPossibleValuesForCell = (
  cells,
  cell,
  considerGuessedValues = true
) => {
  const valuesAvailability = new Array(9).fill(1);

  //get all the cells in range of the selected one
  let cellsInRange = [];
  cellsInRange = cellsInRange.concat(GridFunc.returnSquareCells(cells, cell));
  cellsInRange = cellsInRange.concat(
    GridFunc.returnEntireRowCells(cells, cell)
  );
  cellsInRange = cellsInRange.concat(
    GridFunc.returnEntireColCells(cells, cell)
  );

  //filter out the selected cell
  cellsInRange = cellsInRange.filter((item) => item.key !== cell.key);

  //find which values are already used among all the cells in range
  cellsInRange.forEach((el) => {
    if (el.actualValue > 0) valuesAvailability[el.actualValue - 1] = 0;
    else if (el.solvedValue > 0) valuesAvailability[el.solvedValue - 1] = 0;
    else if (considerGuessedValues && el.guessedValue > 0)
      valuesAvailability[el.guessedValue - 1] = 0;
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
