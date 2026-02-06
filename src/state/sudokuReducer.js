import * as GridFunc from '../scripts/gridFunctions.js';

export const clearGridValues = () => {
  return GridFunc.createEmptyGrid();
};

export const initialState = {
  grid: GridFunc.createEmptyGrid(),
  history: [],
  displayMessage: '',
  cellInfo: {},
  ui: {
    hoveredCell: null,
    highlightedCells: [],
  },
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
      const newGrid = GridFunc.cloneGrid(state.grid);
      if (newGrid.solved[step.key] !== undefined) {
        newGrid.solved[step.key] = step.solvedValue;
      }
      return {
        ...state,
        grid: newGrid,
        history: state.history.slice(1),
      };
    }
    case 'SET_CELLS':
      return {
        ...state,
        grid: action.grid || GridFunc.cellsToGrid(action.cells),
      };
    case 'SET_GRID':
      return { ...state, grid: action.grid };
    case 'SET_DISPLAY_MESSAGE':
      return { ...state, displayMessage: action.message };
    case 'SET_CELL_INFO':
      return { ...state, cellInfo: action.cellInfo };
    case 'SET_UI_STATE':
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.ui,
        },
      };
    case 'CLEAR_GRID':
      return {
        ...state,
        grid: clearGridValues(),
        history: [],
        cellInfo: {},
        ui: {
          ...state.ui,
          hoveredCell: null,
          highlightedCells: [],
        },
      };
    default:
      return state;
  }
}
