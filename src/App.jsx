import React, { useEffect, useState, useRef } from 'react';
import CellDisplay from './components/CellDisplay';
import Cell from './scripts/Cell';
import * as GridFunc from './scripts/gridFunctions.js';
import * as GridValues from './scripts/gridValues.js';
import * as Solver from './scripts/solver.js';
import SidePanel from './components/SidePanel';

import './styles/App.scss';

let history = [];
let clearGrid = false;
function App() {
  const [cells, setCells] = useState([]);
  const [displayMessage, setDisplayMessage] = useState('');
  const [cellInfo, setCellInfo] = useState({});

  useInterval(() => {
    Tick();
  }, 10);

  const Tick = () => {
    // PLAY HISTORY
    if (clearGrid) {
      setCells(ClearGridValues(cells));
      clearGrid = false;
      console.log('clear');
    } else if (history.length > 0) {
      const newCells = [...cells];

      newCells[history[0].key].setSolvedValue(history[0].solvedValue);
      setCells(newCells);
      history.shift();
    }
  };

  const addToHistory = (_newStep) => {
    if (_newStep === -1) {
      history = [];
    } else {
      history = history.concat(_newStep);
    }
  };

  useEffect(() => {
    let tempCells = [];
    for (let i = 0; i < 9 * 9; i++) {
      tempCells.push(new Cell(i));
    }

    console.log(tempCells);
    tempCells = LoadGridValues(tempCells, GridValues.arrayA);
    setCells(tempCells);
  }, []);

  const ClearGridValues = (_cells) => {
    let newCells = GridFunc.cloneGrid(_cells);

    history = []; //clear history
    newCells.forEach((cell) => {
      cell.clearCell();
    });

    return newCells;
  };

  const LoadGridValues = (_cells, values) => {
    let newCells = GridFunc.cloneGrid(_cells);

    history = []; //clear history
    newCells = ClearGridValues(newCells);
    newCells.forEach((cell) => {
      if (values[cell.key] !== 0) {
        cell.setGivenValue(values[cell.key]);
      }
    });
    return newCells;
  };

  /***************** HANDLE CLICKS ****************/

  const handleClickOnClearAll = () => {
    setCells(ClearGridValues(cells));
  };
  const handleClickOnLoadValues = () => {
    setCells(LoadGridValues(cells, GridValues.arrayError));
  };

  const handleClickOnSolve = (stepByStep = false) => {
    if (!Solver.checkIfGridIsValid(cells)) {
      setDisplayMessage('Grid is not valid, please check your values');
      return;
    }

    const solverResult = Solver.solveGrid(
      GridFunc.cloneGrid(cells),
      addToHistory,
      stepByStep
    );
    if (!stepByStep) {
      setCells(solverResult[0]);
    }
    setDisplayMessage(solverResult[1]);
  };

  const handleClickOnGenerate = (stepByStep, difficulty) => {
    if (!Solver.checkIfGridIsValid(cells)) {
      setDisplayMessage('Grid is not valid, please check your values');
      return;
    }

    let generatedGrid = GridFunc.cloneGrid(cells);
    generatedGrid = Solver.generateAGrid(
      generatedGrid,
      addToHistory,
      true,
      difficulty
    );
    if (generatedGrid && !stepByStep) setCells(generatedGrid);
    setDisplayMessage('Grid generated with success');
  };

  const handleClickOnCell = (event, _key, isRightClick = false) => {
    event.preventDefault();
    let newCells = GridFunc.cloneGrid(cells);

    let clickedCell = newCells[_key];

    if (clickedCell != null) {
      //calc new cell value
      let newCellValue = clickedCell.guessedValue + (isRightClick ? -1 : 1);
      newCellValue < 0 && (newCellValue = 9);
      newCellValue > 9 && (newCellValue = 0);

      //assign the new cell value and update de main array;
      clickedCell.setGuessedValue(newCellValue);
      setCells(newCells);
    }
  };

  /************** HANDLE MOUSE OVER *****************/

  const handleMouseOver = (_cellKey) => {
    let newCells = GridFunc.cloneGrid(cells);
    newCells[_cellKey].setPossibleValues(
      Solver.getPossibleValuesForCell(newCells, newCells[_cellKey])
    );
    setCellInfo(newCells[_cellKey].getCellInfo());

    let keysToHighlight = [];
    keysToHighlight = keysToHighlight.concat(
      GridFunc.returnSquareKeys(newCells[_cellKey])
    );
    keysToHighlight = keysToHighlight.concat(
      GridFunc.returnEntireColKeys(newCells, _cellKey)
    );
    keysToHighlight = keysToHighlight.concat(
      GridFunc.returnEntireRowKeys(newCells, _cellKey)
    );

    newCells.forEach((cell) => {
      const highlight = keysToHighlight.indexOf(cell.key) === -1 ? false : true;
      cell.setHovered(highlight);
    });

    setCells(newCells);
  };

  const handleMouseLeaveGrid = () => {
    setCellInfo({});
    const newCells = GridFunc.cloneGrid(cells);
    newCells.forEach((cell) => {
      cell.setHovered(false);
    });
    setCells(newCells);
  };

  /************* RENDER ******************/

  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid" onMouseLeave={handleMouseLeaveGrid}>
          {cells.map((cell) => {
            return (
              <CellDisplay
                key={cell.key}
                cell={cell}
                handleClickOnCell={handleClickOnCell}
                handleMouseOver={handleMouseOver}
              />
            );
          })}
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

// Allow to use interval with hooks
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
