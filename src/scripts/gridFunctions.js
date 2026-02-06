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

export const returnEntireRowKeys = (_grid, cellKey) => {
  const row = Math.floor(cellKey / GRID_SIZE);
  const start = row * GRID_SIZE;
  const result = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    result.push(start + i);
  }
  return result;
};

export const returnEntireColKeys = (_grid, cellKey) => {
  const col = cellKey % GRID_SIZE;
  const result = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    result.push(i * GRID_SIZE + col);
  }
  return result;
};

export const returnSquareKeys = (cellOrKey) => {
  const cellKey = typeof cellOrKey === 'number' ? cellOrKey : cellOrKey.key;
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

export const saveGrid = (grid) => {
  const gridToSave = [...grid.solved];
  console.log(gridToSave);
  return gridToSave;
};

// Migration helpers: convert between the legacy Cell object shape and the
// new plain-array model so both can coexist while refactors land.
export const cellsToGrid = (cells) => {
  const grid = createEmptyGrid();
  cells.forEach((cell) => {
    const key = cell.key;
    grid.given[key] = Boolean(cell.isGiven);
    grid.values[key] =
      cell.actualValue > 0
        ? cell.actualValue
        : cell.guessedValue > 0
          ? cell.guessedValue
          : 0;
    grid.solved[key] = cell.solvedValue > 0 ? cell.solvedValue : 0;
  });
  return grid;
};

export const gridToLegacyCells = (grid, highlightedCells = []) => {
  return Array.from({ length: GRID_CELL_COUNT }, (_, key) => {
    const [x, y] = keyToCoord(key);
    const isGiven = Boolean(grid.given[key]);
    const value = grid.values[key] || 0;
    return {
      key,
      x,
      y,
      guessedValue: isGiven ? 0 : value,
      actualValue: isGiven ? value : 0,
      solvedValue: grid.solved[key] || 0,
      isGiven,
      highlighted: highlightedCells.includes(key),
      possibleValues: [],
    };
  });
};
