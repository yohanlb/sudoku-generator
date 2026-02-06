import { useMemo } from 'react';
import { createSudokuHandlers } from '../state/sudokuHandlers.js';

export function useSudokuHandlers(state, dispatch) {
  return useMemo(
    () => createSudokuHandlers(dispatch, () => state),
    [state, dispatch]
  );
}
