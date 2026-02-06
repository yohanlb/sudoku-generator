export const GRID_SIZE = 9;
export const GRID_CELL_COUNT = GRID_SIZE * GRID_SIZE;

export const createEmptyGrid = () => {
  return {
    values: new Array(GRID_CELL_COUNT).fill(0),
    given: new Array(GRID_CELL_COUNT).fill(false),
    solved: new Array(GRID_CELL_COUNT).fill(0),
  };
};

export const cloneGrid = (grid) => {
  return {
    values: [...grid.values],
    given: [...grid.given],
    solved: [...grid.solved],
  };
};

export const coordToKey = (x, y) => {
  return GRID_SIZE * y + x;
};

export const keyToCoord = (key) => {
  return [key % GRID_SIZE, Math.floor(key / GRID_SIZE)];
};

export const returnEntireRowKeys = (cellKey) => {
  const row = Math.floor(cellKey / GRID_SIZE);
  const start = row * GRID_SIZE;
  const result = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    result.push(start + i);
  }
  return result;
};

export const returnEntireColKeys = (cellKey) => {
  const col = cellKey % GRID_SIZE;
  const result = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    result.push(i * GRID_SIZE + col);
  }
  return result;
};

export const returnSquareKeys = (cellKey) => {
  const [x, y] = keyToCoord(cellKey);
  const dx = Math.floor(x / 3);
  const dy = Math.floor(y / 3);

  const squareKeys = [];
  for (let sy = 0; sy < 3; sy++) {
    for (let sx = 0; sx < 3; sx++) {
      squareKeys.push(coordToKey(dx * 3 + sx, dy * 3 + sy));
    }
  }

  return squareKeys;
};

export const getRelatedCellKeys = (cellKey) => {
  return Array.from(
    new Set([
      ...returnSquareKeys(cellKey),
      ...returnEntireRowKeys(cellKey),
      ...returnEntireColKeys(cellKey),
    ])
  );
};

export const cycleInputValue = (grid, cellKey, delta = 1) => {
  if (grid.given[cellKey]) {
    return grid;
  }

  const nextGrid = cloneGrid(grid);
  const currentValue = nextGrid.values[cellKey];
  let nextValue = currentValue + delta;

  if (nextValue < 0) nextValue = 9;
  if (nextValue > 9) nextValue = 0;

  nextGrid.values[cellKey] = nextValue;
  nextGrid.solved[cellKey] = 0;
  return nextGrid;
};
