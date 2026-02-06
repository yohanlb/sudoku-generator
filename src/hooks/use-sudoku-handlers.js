import { useMemo } from 'react';
import { createSudokuHandlers } from '../state/sudoku-handlers.js';

export function useSudokuHandlers(state, dispatch) {
  return useMemo(
    () => createSudokuHandlers(dispatch, () => state),
    [state, dispatch]
  );
}
