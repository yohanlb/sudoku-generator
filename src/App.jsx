import React, { useReducer } from 'react';
import CellDisplay from './components/CellDisplay';
import * as GridFunc from './scripts/gridFunctions.js';
import * as Solver from './scripts/solver.js';
import SidePanel from './components/SidePanel';
import { useInterval } from './hooks/useInterval';
import { initialState, sudokuReducer } from './state/sudokuReducer';

import './styles/App.scss';

function App() {
  const [state, dispatch] = useReducer(sudokuReducer, initialState);
  const { grid, ui, displayMessage, cellInfo } = state;

  const addToHistory = (newStep) => {
    if (newStep === -1) {
      dispatch({ type: 'CLEAR_HISTORY' });
    } else {
      dispatch({ type: 'QUEUE_STEP', step: newStep });
    }
  };

  useInterval(() => {
    dispatch({ type: 'APPLY_STEP' });
  }, 10);

  /***************** HANDLE CLICKS ****************/

  const handleClickOnClearAll = () => {
    dispatch({ type: 'CLEAR_GRID' });
  };

  const handleClickOnSolve = (stepByStep = false) => {
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
    if (grid.given[cellKey]) return;

    const newGrid = GridFunc.cloneGrid(grid);
    let newCellValue = newGrid.values[cellKey] + (isRightClick ? -1 : 1);
    if (newCellValue < 0) newCellValue = 9;
    if (newCellValue > 9) newCellValue = 0;

    newGrid.values[cellKey] = newCellValue;
    newGrid.solved[cellKey] = 0;
    dispatch({ type: 'SET_GRID', grid: newGrid });
  };

  /************** HANDLE MOUSE OVER *****************/

  const handleMouseOver = (cellKey) => {
    const possibleValues = Solver.getPossibleValuesForCell(grid, cellKey);
    const [x, y] = GridFunc.keyToCoord(cellKey);
    dispatch({
      type: 'SET_CELL_INFO',
      cellInfo: {
        key: cellKey,
        x,
        y,
        possibleValues,
      },
    });

    const keysToHighlight = Array.from(
      new Set([
        ...GridFunc.returnSquareKeys(cellKey),
        ...GridFunc.returnEntireColKeys(grid, cellKey),
        ...GridFunc.returnEntireRowKeys(grid, cellKey),
      ])
    );
    dispatch({
      type: 'SET_UI_STATE',
      ui: {
        hoveredCell: cellKey,
        highlightedCells: keysToHighlight,
      },
    });
  };

  const handleMouseLeaveGrid = () => {
    dispatch({ type: 'SET_CELL_INFO', cellInfo: {} });
    dispatch({
      type: 'SET_UI_STATE',
      ui: {
        hoveredCell: null,
        highlightedCells: [],
      },
    });
  };

  /************* RENDER ******************/

  const highlightedLookup = new Set(ui.highlightedCells);

  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid" onMouseLeave={handleMouseLeaveGrid}>
          {Array.from({ length: GridFunc.GRID_CELL_COUNT }, (_, cellKey) => (
            <CellDisplay
              key={cellKey}
              cellKey={cellKey}
              value={grid.values[cellKey]}
              solvedValue={grid.solved[cellKey]}
              isGiven={grid.given[cellKey]}
              isHighlighted={highlightedLookup.has(cellKey)}
              handleClickOnCell={handleClickOnCell}
              handleMouseOver={handleMouseOver}
            />
          ))}
        </div>
      </div>

      <SidePanel
        cellInfo={cellInfo}
        handleClickOnSolve={handleClickOnSolve}
        handleClickOnClearAll={handleClickOnClearAll}
        displayMessage={displayMessage}
      />
    </div>
  );
}

export default App;
