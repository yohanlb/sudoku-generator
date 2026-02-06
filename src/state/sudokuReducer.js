import * as GridFunc from '../scripts/gridFunctions.js';

export const ClearGridValues = (cells) => {
  const newCells = GridFunc.cloneGrid(cells);
  newCells.forEach((cell) => {
    cell.clearCell();
  });
  return newCells;
};

export const initialState = {
  cells: [],
  history: [],
  displayMessage: '',
  cellInfo: {},
};

export function sudokuReducer(state, action) {
  switch (action.type) {
    case 'QUEUE_STEP':
      return { ...state, history: [...state.history, action.step] };
    case 'CLEAR_HISTORY':
      return { ...state, history: [] };
    case 'APPLY_STEP': {
      if (state.history.length === 0) return state;
      const step = state.history[0];
      const newCells = GridFunc.cloneGrid(state.cells);
      if (newCells[step.key]) {
        newCells[step.key].setSolvedValue(step.solvedValue);
      }
      return {
        ...state,
        cells: newCells,
        history: state.history.slice(1),
      };
    }
    case 'SET_CELLS':
      return { ...state, cells: action.cells };
    case 'SET_DISPLAY_MESSAGE':
      return { ...state, displayMessage: action.message };
    case 'SET_CELL_INFO':
      return { ...state, cellInfo: action.cellInfo };
    case 'CLEAR_GRID':
      return {
        ...state,
        cells: ClearGridValues(state.cells),
        history: [],
      };
    default:
      return state;
  }
}
