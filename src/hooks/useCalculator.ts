import { useReducer, useMemo, useCallback } from 'react';
import { evaluate } from '../logic/evaluate';
import type { Key } from '../keys';
import { BACKSPACE_KEY, CLEAR_KEY, initialState } from './calculator.types';
import { calculatorReducer } from './calculator.reducer';

export type { Entry, EntryType, State } from './calculator.types';
export { calculatorReducer, initialState };

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const displayText = useMemo(
    () => (state.entries.length === 0 ? '0' : state.entries.map((e) => e.display).join('')),
    [state.entries],
  );

  const mathExpression = useMemo(
    () => state.entries.map((e) => e.math).join(''),
    [state.entries],
  );

  const press = useCallback((key: Key): void => {
    if (key.kind === 'equals') {
      if (state.entries.length === 0) return;
      const resultStr = String(evaluate(mathExpression)).replace('e+', 'e');
      dispatch({ type: 'SET_RESULT', result: resultStr });
      return;
    }
    dispatch({ type: 'PRESS', key });
  }, [mathExpression, state.entries.length]);

  return {
    displayText,
    mathExpression,
    entries:          state.entries,
    openBracketCount: state.openBracketCount,
    isResult:         state.isResult,
    press,
    backspace: () => press(BACKSPACE_KEY),
    clearCalc: () => press(CLEAR_KEY),
  };
}
