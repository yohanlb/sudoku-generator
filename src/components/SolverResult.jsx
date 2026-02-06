import React from 'react';

function SolverResult({ solverResult, step }) {
  if (solverResult !== '') {
    return (
      <p>
        <b>Solver result : </b>
        {solverResult}
      </p>
    );
  } else return null;
}

export default SolverResult;
