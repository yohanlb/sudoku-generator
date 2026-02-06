import React, { useReducer } from 'react';
import CellDisplay from './components/CellDisplay';
import SidePanel from './components/SidePanel';
import { useInterval } from './hooks/useInterval';
import { useSudokuHandlers } from './hooks/useSudokuHandlers';
import { initialState, sudokuReducer } from './state/sudokuReducer';

import './styles/App.scss';

function App() {
  const [state, dispatch] = useReducer(sudokuReducer, initialState);
  const { grid, ui, displayMessage, cellInfo } = state;
  const handlers = useSudokuHandlers(state, dispatch);

  useInterval(() => {
    dispatch({ type: 'APPLY_STEP' });
  }, 10);

  const highlightedLookup = new Set(ui.highlightedCells);

  return (
    <div className="App">
      <div className="grid-container">
        <div className="grid" onMouseLeave={handlers.handleMouseLeaveGrid}>
          {Array.from({ length: grid.values.length }, (_, cellKey) => (
            <CellDisplay
              key={cellKey}
              cellKey={cellKey}
              value={grid.values[cellKey]}
              solvedValue={grid.solved[cellKey]}
              isGiven={grid.given[cellKey]}
              isHighlighted={highlightedLookup.has(cellKey)}
              handleClickOnCell={handlers.handleClickOnCell}
              handleMouseOver={handlers.handleMouseOver}
            />
          ))}
        </div>
      </div>

      <SidePanel
        cellInfo={cellInfo}
        handleClickOnSolve={handlers.handleClickOnSolve}
        handleClickOnClearAll={handlers.handleClickOnClearAll}
        displayMessage={displayMessage}
      />
    </div>
  );
}

export default App;
