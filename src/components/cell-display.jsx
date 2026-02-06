import React, { useState } from 'react';

function CellDisplay({
  cellKey,
  value,
  solvedValue,
  isGiven,
  isHighlighted,
  handleClickOnCell,
  handleMouseOver,
}) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e, isRightClick = false) => {
    handleClickOnCell(e, cellKey, isRightClick);
    setIsClicked(true);
  };

  const displayCellValue = () => {
    if (isGiven) {
      const cellClass =
        'cell-inner isGiven ' + (isHighlighted ? ' highlighted' : '');
      return (
        <div
          className={cellClass}
          onMouseOver={() => {
            handleMouseOver(cellKey);
          }}
        >
          <span className="cell-number">{value}</span>
        </div>
      );
    } else if (solvedValue > 0) {
      const cellClass =
        'cell-inner isSolved ' + (isHighlighted ? ' highlighted' : '');
      return (
        <div
          className={cellClass}
          onMouseOver={() => {
            handleMouseOver(cellKey);
          }}
        >
          <span className="cell-number">{solvedValue}</span>
        </div>
      );
    } else if (value > 0) {
      const cellClass =
        'cell-inner isActual ' + (isHighlighted ? ' highlighted' : '');
      return (
        <div
          className={cellClass}
          onMouseOver={() => {
            handleMouseOver(cellKey);
          }}
        >
          <span className="cell-number">{value}</span>
        </div>
      );
    } else {
      const cellClass =
        'cell-inner notGiven ' +
        (isClicked ? ' clicked' : '') +
        (isHighlighted ? ' highlighted' : '');
      return (
        <div
          className={cellClass}
          onMouseOver={() => {
            handleMouseOver(cellKey);
          }}
          onTransitionEnd={() => {
            setIsClicked(false);
          }}
          onClick={(e) => {
            handleClick(e);
          }}
          onContextMenu={(e) => {
            handleClick(e, true);
          }}
        >
          <span className="cell-number">{value === 0 ? '' : value}</span>
        </div>
      );
    }
  };

  return displayCellValue();
}

export default CellDisplay;
