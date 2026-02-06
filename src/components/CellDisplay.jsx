import React, { useState } from "react";

function CellDisplay({ cell, handleClickOnCell,handleMouseOver }) {
  const [clickedOn, setClickedOn] = useState(false);

  const handleClick = (e, isRightClick = false) => {
    handleClickOnCell(e, cell.key, isRightClick);
    setClickedOn(true);
  };

  const displayCellValue = () => {
    if (cell.isGiven){
      const cellClass = "cell-inner isGiven " + (cell.highlighted ? " highlighted" : "");
      return (

        <div 
        className={cellClass}
        onMouseOver={() => {handleMouseOver(cell.key)}}
        >
          <span className="cell-number">{cell.actualValue}</span>
        </div>
      );
    }

    else if(cell.solvedValue > 0){
      const cellClass = "cell-inner isSolved " + (cell.highlighted ? " highlighted" : "");
      return (

        <div 
          className={cellClass}
          onMouseOver={() => {handleMouseOver(cell.key)}}
        >
          <span className="cell-number">{cell.solvedValue}</span>
        </div>
      );
    }

    else if(cell.actualValue > 0){
      const cellClass = "cell-inner isActual " + (cell.highlighted ? " highlighted" : "");
      return (

        <div 
          className={cellClass}
          onMouseOver={() => {handleMouseOver(cell.key)}}
        >
          <span className="cell-number">{cell.actualValue}</span>
        </div>
      );
    }

    else {
      const cellClass = "cell-inner notGiven " + (clickedOn ? " clicked" : "") + (cell.highlighted ? " highlighted" : "");
      return (

        <div
          className={cellClass}
          onMouseOver={() => {handleMouseOver(cell.key)}}
          onTransitionEnd={() => {setClickedOn(false)}}
          onClick={(e) => {
            handleClick(e);
          }}
          onContextMenu={(e) => {
            handleClick(e, true);
          }}
        >
          <span className="cell-number">
            {cell.guessedValue === 0 ? "" : cell.guessedValue}
          </span>
        </div>
      );
    }
  };

  return displayCellValue();
}

export default CellDisplay;
