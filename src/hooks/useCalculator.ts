import { useReducer, useMemo } from 'react';
import type { Key, KeyKind } from '../keys';

export type EntryType =
  | 'NUMBER'
  | 'OPERATOR'
  | 'DOT'
  | 'OPEN_BRACKET'
  | 'CLOSE_BRACKET';

export type Entry = {
  type: EntryType;
  value: string;
};

export type State = {
  entries: Entry[];
  openBracketCount: number;
  hasDot: boolean;
};

export const initialState: State = {
  entries: [],
  openBracketCount: 0,
  hasDot: false,
};

const createEntry = (type: EntryType, value: string): Entry => ({ type, value });
const num = (value: string) => createEntry('NUMBER', value);
const op = (value: string) => createEntry('OPERATOR', value);

function getLast(state: State): Entry | undefined {
  return state.entries[state.entries.length - 1];
}

function isPostfixUnit(entry?: Entry): boolean {
  return entry?.value === '%' || entry?.value === '^2';
}

function hasPrecedingOperand(state: State): boolean {
  const last = getLast(state);
  if (!last) return false;
  return (
    last.type === 'NUMBER' ||
    last.type === 'CLOSE_BRACKET' ||
    isPostfixUnit(last)
  );
}

function appendEntries(
  state: State,
  newEntries: Entry[],
  overrides: Partial<State> = {}
): State {
  return {
    ...state,
    ...overrides,
    entries: [...state.entries, ...newEntries],
  };
}

function getImplicitMult(state: State): Entry[] {
  return hasPrecedingOperand(state) ? [op('*')] : [];
}

export function handleNumber(state: State, key: Key): State {
  const last = getLast(state);
  if (last?.value === '0' && key.value === '0' && !state.hasDot) {
    return state;
  }

  const isConst = key.value === 'pi' || key.value === 'e';
  const shouldMult = last?.type === 'CLOSE_BRACKET' || (isConst && hasPrecedingOperand(state));
  const nextEntries = shouldMult ? [op('*'), num(key.value)] : [num(key.value)];

  return appendEntries(state, nextEntries);
}

export function handleDot(state: State): State {
  const last = getLast(state);
  if (state.hasDot || isPostfixUnit(last)) return state;

  const prefix = hasPrecedingOperand(state) ? [] : [num('0')];
  return appendEntries(state, [...prefix, createEntry('DOT', '.')], { hasDot: true });
}

export function handleInfix(state: State, key: Key): State {
  const last = getLast(state);
  const secondLast = state.entries[state.entries.length - 2];

  if (key.value === '-' && last?.type === 'OPEN_BRACKET') {
    return appendEntries(state, [op('-')], { hasDot: false });
  }

  if (
    last?.type === 'OPERATOR' &&
    last.value === '-' &&
    secondLast?.type === 'OPERATOR'
  ) {
    if (key.value === '+') {
      return {
        ...state,
        entries: state.entries.slice(0, -1),
      };
    }
    if (key.value === '-') {
      return state; 
    }
    const updated = state.entries.slice(0, -2);
    return {
      ...state,
      entries: [...updated, op(key.value)],
    };
  }

  const isMultiplicativeOrPower =
    last?.type === 'OPERATOR' &&
    (last.value === '*' || last.value === '/' || last.value === '^');

  if (isMultiplicativeOrPower && key.value === '-') {
    return appendEntries(state, [op('-')], { hasDot: false });
  }

  if (last?.type === 'OPERATOR' && !isPostfixUnit(last)) {
    const updated = [...state.entries];
    updated[updated.length - 1] = op(key.value);
    return { ...state, entries: updated };
  }

  if (hasPrecedingOperand(state)) {
    return appendEntries(state, [op(key.value)], { hasDot: false });
  }

  return state;
}

export function handlePostfix(state: State, key: Key): State {
  const last = getLast(state);
  if (hasPrecedingOperand(state) && !isPostfixUnit(last)) {
    return appendEntries(state, [op(key.value)], { hasDot: false });
  }
  return state;
}

export function handlePrefixFn(state: State, key: Key): State {
  return appendEntries(
    state,
    [...getImplicitMult(state), createEntry('OPEN_BRACKET', key.value)],
    { openBracketCount: state.openBracketCount + 1, hasDot: false }
  );
}

export function handleFraction(state: State): State {
  return appendEntries(
    state,
    [...getImplicitMult(state), num('1'), op('/')],
    { hasDot: false }
  );
}

export function handleBracketSmart(state: State): State {
  const hasOperand = hasPrecedingOperand(state);

  if (hasOperand && state.openBracketCount > 0) {
    return appendEntries(
      state,
      [createEntry('CLOSE_BRACKET', ')')],
      { openBracketCount: state.openBracketCount - 1 }
    );
  }

  return appendEntries(
    state,
    [...getImplicitMult(state), createEntry('OPEN_BRACKET', '(')],
    { openBracketCount: state.openBracketCount + 1, hasDot: false }
  );
}

export function handleBackspace(state: State): State {
  if (state.entries.length === 0) return state;
  const removed = state.entries[state.entries.length - 1];
  return {
    entries: state.entries.slice(0, -1),
    openBracketCount:
      removed.type === 'OPEN_BRACKET'
        ? Math.max(0, state.openBracketCount - 1)
        : removed.type === 'CLOSE_BRACKET'
        ? state.openBracketCount + 1
        : state.openBracketCount,
    hasDot: removed.type === 'DOT' ? false : state.hasDot,
  };
}

type Handler = (state: State, key: Key) => State;

const HANDLERS: Record<KeyKind, Handler> = {
  number: handleNumber,
  dot: handleDot,
  infix_operator: handleInfix,
  postfix_operator: handlePostfix,
  prefix_function: handlePrefixFn,
  fraction_prefix: handleFraction,
  bracket_smart: handleBracketSmart,
  backspace: (state) => handleBackspace(state),
  clear: () => initialState,
  equals: (state) => state,
};

type Action =
  | { type: 'PRESS'; key: Key }
  | { type: 'BACKSPACE' }
  | { type: 'CLEAR' };

export function calculatorReducer(state: State, action: Action): State {
  if (action.type === 'CLEAR') return initialState;
  if (action.type === 'BACKSPACE') return handleBackspace(state);

  const handler = HANDLERS[action.key.kind];
  return handler ? handler(state, action.key) : state;
}

export function useCalculator() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  const displayText = useMemo(() => {
    if (state.entries.length === 0) return '0';
    return state.entries.map((e) => e.value).join('');
  }, [state.entries]);

  return {
    displayText,
    entries: state.entries,
    openBracketCount: state.openBracketCount,
    press: (key: Key) => dispatch({ type: 'PRESS', key }),
    backspace: () => dispatch({ type: 'BACKSPACE' }),
    clearCalc: () => dispatch({ type: 'CLEAR' }),
  };
}