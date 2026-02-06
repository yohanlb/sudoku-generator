import React from 'react';

import '../styles/SidePanel.scss';

function SidePanel({
  handleClickOnSolve,
  handleClickOnClearAll,
  cellInfo,
  displayMessage,
}) {
  let cellInfoDisplay = '';
  if (Object.keys(cellInfo).length > 0) {
    cellInfoDisplay = (
      <div className="cell-info-inner">
        <h3>
          Cell #{cellInfo.key} [{cellInfo.x}, {cellInfo.y}]
        </h3>
        <p>Possible values : {cellInfo.possibleValues.join(', ')} </p>
      </div>
    );
  }

  let displayMessageElement = '';
  if (displayMessage !== '') {
    displayMessageElement = (
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
        </div>

        <div className="cell-info-container">
          {displayMessageElement}

          {cellInfoDisplay}
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
