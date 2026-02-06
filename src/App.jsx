import React, { useEffect, useReducer } from 'react';
import CellDisplay from './components/CellDisplay';
import Cell from './scripts/Cell';
import * as GridFunc from './scripts/gridFunctions.js';
import * as GridValues from './scripts/gridValues.js';
import * as Solver from './scripts/solver.js';
import SidePanel from './components/SidePanel';
import { useInterval } from './hooks/useInterval';
import {
  initialState,
  LoadGridValues,
  sudokuReducer,
} from './state/sudokuReducer';

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
    let tempCells = [];
    for (let i = 0; i < 9 * 9; i++) {
      tempCells.push(new Cell(i));
    }
    dispatch({ type: 'SET_CELLS', cells: tempCells });
  }, []);

  /***************** HANDLE CLICKS ****************/

  const handleClickOnClearAll = () => {
    dispatch({ type: 'CLEAR_GRID' });
  };

  const handleClickOnLoadValues = () => {
    const newCells = LoadGridValues(cells, GridValues.arrayError);
    dispatch({ type: 'SET_CELLS', cells: newCells });
    dispatch({ type: 'CLEAR_HISTORY' });
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

  const handleClickOnGenerate = (stepByStep, nbOfCellsToShow) => {
    // Generate feature disabled
    dispatch({
      type: 'SET_DISPLAY_MESSAGE',
      message: 'Generate feature temporarily disabled',
    });
  };

  const handleClickOnCell = (event, _key, isRightClick = false) => {
    event.preventDefault();
    const newCells = GridFunc.cloneGrid(cells);
    const clickedCell = newCells[_key];
    if (clickedCell != null) {
      let newCellValue = clickedCell.guessedValue + (isRightClick ? -1 : 1);
      if (newCellValue < 0) newCellValue = 9;
      if (newCellValue > 9) newCellValue = 0;
      clickedCell.setGuessedValue(newCellValue);
      dispatch({ type: 'SET_CELLS', cells: newCells });
    }
  };

  /************** HANDLE MOUSE OVER *****************/

  const handleMouseOver = (_cellKey) => {
    const newCells = GridFunc.cloneGrid(cells);
    newCells[_cellKey].setPossibleValues(
      Solver.getPossibleValuesForCell(newCells, newCells[_cellKey])
    );
    dispatch({
      type: 'SET_CELL_INFO',
      cellInfo: newCells[_cellKey].getCellInfo(),
    });

    const keysToHighlight = [
      ...GridFunc.returnSquareKeys(newCells[_cellKey]),
      ...GridFunc.returnEntireColKeys(newCells, _cellKey),
      ...GridFunc.returnEntireRowKeys(newCells, _cellKey),
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
        handleClickOnGenerate={handleClickOnGenerate}
        handleClickOnClearAll={handleClickOnClearAll}
        handleClickOnLoadValues={handleClickOnLoadValues}
        displayMessage={displayMessage}
      />
    </div>
  );
}

export default App;
