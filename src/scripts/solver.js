import * as GridFunc from './gridFunctions.js';

let loopCount;
const maxLoop = 300;

export const solveGrid = (_cells, addToHistory = null, stepByStep = false) => {
  let newCells = GridFunc.cloneGrid(_cells);
  let res = false;

  if (!checkIfGridIsValid(_cells)) {
    console.log('grid not valid');
  }

  let tentatives = 0;

  while (!res && tentatives < 50) {
    loopCount = 0;
    tentatives++;
    newCells = GridFunc.cloneGrid(_cells);
    res = recursiveSolver(newCells, 0, addToHistory, stepByStep);
  }
  console.log(
    'loop count : ',
    loopCount,
    'tentatives : ',
    tentatives,
    'res : ',
    res
  );

  if (!res) {
    GridFunc.saveGrid(newCells);
  }
  const resString = res ? 'Success' : 'Error';
  return [newCells, resString];
};

const recursiveSolver = (_cells, key, addToHistory, stepByStep) => {
  loopCount++;
  if (loopCount > maxLoop) {
    return false;
  }
  if (!checkIfGridIsValid(_cells)) {
    console.log('grid not valid');
  }
  if (loopCount > maxLoop + 100)
    throw new Error('Error while solving the grid');
  const useGuessedValues = true;

  if (key >= 9 * 9) {
    return true;
  } //Solving finished

  const currentCell = _cells[key];
  const cellValue =
    currentCell.solvedValue > 0 ||
    currentCell.actualValue > 0 ||
    (useGuessedValues && currentCell.guessedValue > 0);

  // this cell is already solved, go to next cell
  if (cellValue) {
    return recursiveSolver(_cells, key + 1, addToHistory, stepByStep);
  }

  const pValues = getPossibleValuesForCell(_cells, currentCell);
  let shuffledVal = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let v = 1; v <= 9; v++) {
    if (pValues.some((e) => e === shuffledVal[v - 1])) {
      setSolvedValueWithHistory(
        currentCell,
        shuffledVal[v - 1],
        stepByStep,
        addToHistory
      );

      // try to resolve the rest of the array with this value for the current cell
      if (recursiveSolver(_cells, key + 1, addToHistory, stepByStep))
        return true;
    }
  }

  setSolvedValueWithHistory(currentCell, 0, stepByStep, addToHistory);

  return false; // this grid is not solvable, going back to previous recursion.
};

export const checkIfGridIsValid = (_cells) => {
  let res = true;
  _cells.forEach((cell) => {
    const pValues = getPossibleValuesForCell(_cells, cell, true);
    /*
        if (pValues.length === 0 ) {
            console.log("No possible value for cell : ", cell.key);
            res = false;
        }*/

    let cellValue = 0;
    if (cell.actualValue > 0) {
      cellValue = cell.actualValue;
    } else if (cell.solvedValue > 0) {
      cellValue = cell.solvedValue;
    } else if (cell.guessedValue > 0) {
      cellValue = cell.guessedValue;
    }
    if (cellValue > 0 && pValues.indexOf(cellValue) === -1) {
      // if there is more than one cell with the same value
      console.log('Wrong grid values for cell : ', cell.key);
      res = false;
    }
  });

  return res;
};

//**********************   Utilities  **************************************/

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const setSolvedValueWithHistory = (_cell, _val, stepByStep, addToHistory) => {
  _cell.setSolvedValue(_val);
  if (stepByStep && _val > 0) {
    addToHistory({
      key: _cell.key,
      solvedValue: _val,
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
