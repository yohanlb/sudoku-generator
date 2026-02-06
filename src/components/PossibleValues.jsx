import React from 'react';

function PossibleValues({ possibleValues }) {
  if (possibleValues.length > 0) {
    return (
      <div>
        <p>
          Possible values :
          {possibleValues.map((val) => {
            return <b key={val}> {val} </b>;
          })}
        </p>
      </div>
    );
  } else {
    return null;
  }
}

export default PossibleValues;
