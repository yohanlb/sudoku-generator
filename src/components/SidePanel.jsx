import React from 'react';

import SolverResult from './SolverResult';

import '../styles/SidePanel.scss';

function SidePanel({
  handleClickOnSolve,
  handleClickOnGenerate,
  handleClickOnLoadValues,
  handleClickOnClearAll,
  solverResult,
  cellInfo,
  displayMessage,
}) {
  let DivCellInfo = '';
  if (Object.keys(cellInfo).length > 0) {
    DivCellInfo = (
      <div className="cell-info-inner">
        <h3>
          Cell #{cellInfo.key} [{cellInfo.x}, {cellInfo.y}]
        </h3>
        <p>Possible values : {cellInfo.possibleValues.join(', ')} </p>
      </div>
    );
  }

  let DivDisplayMessage = '';
  if (displayMessage !== '') {
    DivDisplayMessage = (
      <div className="user-message">
        <p>
          <b>{displayMessage}</b>
        </p>
      </div>
    );
  }

  return (
    <div className="side-panel">
      <div className="side-panel-container">
        <div className="button-container button-container-clear">
          <button onClick={handleClickOnClearAll}>CLEAR ALL</button>
        </div>

        <div className="button-container button-container-generate">
          <h3>Generator</h3>
          {/* <button onClick={handleClickOnLoadValues}>Load default values</button> */}
          <button
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Generate grid Easy
          </button>
          <button
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Generate grid Medium
          </button>
          <button
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            Generate grid Hard
          </button>
        </div>

        <div className="button-container button-container-solver">
          <h3>Solver</h3>
          <button
            onClick={() => {
              handleClickOnSolve(false);
            }}
          >
            Solve
          </button>
          <button
            onClick={() => {
              handleClickOnSolve(true);
            }}
          >
            Solve (step by step)
          </button>
          <SolverResult solverResult={solverResult} />
        </div>

        <div className="cell-info-container">
          {DivDisplayMessage}

          {DivCellInfo}
        </div>

        <div className="fixed-bottom-right">
          <a
            href="https://github.com/yohanlb/sudoku-generator"
            target="_blank"
            rel="noopener noreferrer"
          >
            See code
          </a>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
