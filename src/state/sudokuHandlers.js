import * as GridFunc from '../core/grid.js';
import * as Solver from '../core/solver.js';

function getHoverPayload(grid, cellKey) {
  const possibleValues = Solver.getPossibleValuesForCell(grid, cellKey);
  const [x, y] = GridFunc.keyToCoord(cellKey);
  const highlightedCells = GridFunc.getRelatedCellKeys(cellKey);
  const cellInfo = {
    key: cellKey,
    x,
    y,
    possibleValues,
  };
  return { cellInfo, highlightedCells };
}

export function createSudokuHandlers(dispatch, getState) {
  const addToHistory = (newStep) => {
    if (newStep === -1) {
      dispatch({ type: 'CLEAR_HISTORY' });
    } else {
      dispatch({ type: 'QUEUE_STEP', step: newStep });
    }
  };

  const handleClickOnClearAll = () => {
    dispatch({ type: 'CLEAR_GRID' });
  };

  const handleClickOnSolve = (stepByStep = false) => {
    const { grid } = getState();
    if (!Solver.checkIfGridIsValid(grid)) {
      dispatch({
        type: 'SET_DISPLAY_MESSAGE',
        message: 'Grid is not valid, please check your values',
      });
      return;
    }
    const solverResult = Solver.solveGrid(
      GridFunc.cloneGrid(grid),
      addToHistory,
      stepByStep
    );
    if (!stepByStep) {
      dispatch({ type: 'SET_GRID', grid: solverResult[0] });
    }
    dispatch({ type: 'SET_DISPLAY_MESSAGE', message: solverResult[1] });
  };

  const handleClickOnCell = (event, cellKey, isRightClick = false) => {
    event.preventDefault();
    const { grid } = getState();
    const newGrid = GridFunc.cycleInputValue(
      grid,
      cellKey,
      isRightClick ? -1 : 1
    );
    if (newGrid !== grid) {
      dispatch({ type: 'SET_GRID', grid: newGrid });
    }
  };

  const handleMouseOver = (cellKey) => {
    const { grid } = getState();
    const { cellInfo, highlightedCells } = getHoverPayload(grid, cellKey);
    dispatch({
      type: 'SET_HOVER_CELL',
      payload: {
        cellKey,
        cellInfo,
        highlightedCells,
      },
    });
  };

  const handleMouseLeaveGrid = () => {
    dispatch({ type: 'CLEAR_HOVER' });
  };

  return {
    handleClickOnClearAll,
    handleClickOnSolve,
    handleClickOnCell,
    handleMouseOver,
    handleMouseLeaveGrid,
  };
}
