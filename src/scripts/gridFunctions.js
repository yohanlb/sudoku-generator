/**
 * Return the keys of all the other cells in the Col.
 * @param {object} cell an object of type "cell".
 * @returns {Array} Array of cells keys.
 */
/*
export const returnEntireColKeys = (cell) => {

    const res = []
    for (let i = 0; i < 9; i++) {
        res.push(cell.x + 9 * i);
    }
    return res;
}
*/

export const cloneGrid = (_cells) => {
  return _cells.map((object) => ({ ...object }));
};

export const returnEntireRowCells = (cells, cell) => {
  const row = cell.y;
  const entireRow = [];

  for (let i = 0; i < 9 * 9; i++) {
    if (Math.floor(i / 9) === row) {
      entireRow.push(cells[i]);
    }
  }
  return entireRow;
};

export const returnEntireRowKeys = (_cells, _key) => {
  const row = _cells[_key].y;
  const entireRow = [];

  for (let i = 0; i < 9 * 9; i++) {
    if (Math.floor(i / 9) === row) {
      entireRow.push(i);
    }
  }
  return entireRow;
};

export const returnEntireColCells = (cells, cell) => {
  const entireCol = [];
  const col = cell.x;

  for (let i = 0; i < 9 * 9; i++) {
    if (i % 9 === col) {
      entireCol.push(cells[i]);
    }
  }
  return entireCol;
};

export const returnEntireColKeys = (_cells, _key) => {
  const entireCol = [];
  const col = _cells[_key].x;

  for (let i = 0; i < 9 * 9; i++) {
    if (i % 9 === col) {
      entireCol.push(i);
    }
  }
  return entireCol;
};

export const coordToKey = (x, y) => {
  return 9 * y + x;
};
export const KeyToCoord = (key) => {
  return [key % 9, Math.floor(key / 9)];
};

export const returnSquareKeys = (cell) => {
  const dx = Math.floor(cell.x / 3);
  const dy = Math.floor(cell.y / 3);

  const squareCoords = [
    [dx * 3 + 0, dy * 3 + 0],
    [dx * 3 + 1, dy * 3 + 0],
    [dx * 3 + 2, dy * 3 + 0],
    [dx * 3 + 0, dy * 3 + 1],
    [dx * 3 + 1, dy * 3 + 1],
    [dx * 3 + 2, dy * 3 + 1],
    [dx * 3 + 0, dy * 3 + 2],
    [dx * 3 + 1, dy * 3 + 2],
    [dx * 3 + 2, dy * 3 + 2],
  ];

  const squareKeys = [];

  squareCoords.forEach((cellCoords) => {
    squareKeys.push(coordToKey(cellCoords[0], cellCoords[1]));
  });

  return squareKeys;
};

export const getSeveralCellByKey = (cells, keys) => {
  const res = [];
  cells.forEach((cell) => {
    const isSearched = keys.some((key) => key === cell.key);
    if (isSearched) {
      res.push(cell);
    }
  });

  return res;
};

export const returnSquareCells = (cells, cell) => {
  const keys = returnSquareKeys(cell);
  return getSeveralCellByKey(cells, keys);
};

export const saveGrid = (_cells) => {
  const gridToSave = [9 * 9];

  _cells.forEach((cell) => {
    gridToSave[cell.key] = cell.solvedValue;
  });

  console.log(gridToSave);
  return gridToSave;
};
