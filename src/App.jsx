import React, { useEffect, useReducer } from 'react';
import CellDisplay from './components/CellDisplay';
import Cell from './scripts/Cell';
import * as GridFunc from './scripts/gridFunctions.js';
import * as Solver from './scripts/solver.js';
import SidePanel from './components/SidePanel';
import { useInterval } from './hooks/useInterval';
import { initialState, sudokuReducer } from './state/sudokuReducer';

import './styles/App.scss';

function App() {
  const [state, dispatch] = useReducer(sudokuReducer, initialState);
  const { cells, displayMessage, cellInfo } = state;

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

  useEffect(() => {
    const initialCells = [];
    for (let i = 0; i < 9 * 9; i++) {
      initialCells.push(new Cell(i));
    }
    dispatch({ type: 'SET_CELLS', cells: initialCells });
  }, []);

  /***************** HANDLE CLICKS ****************/

  const handleClickOnClearAll = () => {
    dispatch({ type: 'CLEAR_GRID' });
  };

  const handleClickOnSolve = (stepByStep = false) => {
    if (!Solver.checkIfGridIsValid(cells)) {
      dispatch({
        type: 'SET_DISPLAY_MESSAGE',
        message: 'Grid is not valid, please check your values',
      });
      return;
    }
    const solverResult = Solver.solveGrid(
      GridFunc.cloneGrid(cells),
      addToHistory,
      stepByStep
    );
    if (!stepByStep) {
      dispatch({ type: 'SET_CELLS', cells: solverResult[0] });
    }
    dispatch({ type: 'SET_DISPLAY_MESSAGE', message: solverResult[1] });
  };

  const handleClickOnCell = (event, cellKey, isRightClick = false) => {
    event.preventDefault();
    const newCells = GridFunc.cloneGrid(cells);
    const clickedCell = newCells[cellKey];
    if (clickedCell != null) {
      let newCellValue = clickedCell.guessedValue + (isRightClick ? -1 : 1);
      if (newCellValue < 0) newCellValue = 9;
      if (newCellValue > 9) newCellValue = 0;
      clickedCell.setGuessedValue(newCellValue);
      dispatch({ type: 'SET_CELLS', cells: newCells });
    }
  };

  /************** HANDLE MOUSE OVER *****************/

  const handleMouseOver = (cellKey) => {
    const newCells = GridFunc.cloneGrid(cells);
    newCells[cellKey].setPossibleValues(
      Solver.getPossibleValuesForCell(newCells, newCells[cellKey])
    );
    dispatch({
      type: 'SET_CELL_INFO',
      cellInfo: newCells[cellKey].getCellInfo(),
    });

    const keysToHighlight = [
      ...GridFunc.returnSquareKeys(newCells[cellKey]),
      ...GridFunc.returnEntireColKeys(newCells, cellKey),
      ...GridFunc.returnEntireRowKeys(newCells, cellKey),
    ];

    newCells.forEach((cell) => {
      cell.setHovered(keysToHighlight.indexOf(cell.key) !== -1);
    });
    dispatch({ type: 'SET_CELLS', cells: newCells });
  };

  const handleMouseLeaveGrid = () => {
    dispatch({ type: 'SET_CELL_INFO', cellInfo: {} });
    const newCells = GridFunc.cloneGrid(cells);
    newCells.forEach((cell) => {
      cell.setHovered(false);
    });
    dispatch({ type: 'SET_CELLS', cells: newCells });
  };

  /************* RENDER ******************/

  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid" onMouseLeave={handleMouseLeaveGrid}>
          {cells.map((cell) => (
            <CellDisplay
              key={cell.key}
              cell={cell}
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
