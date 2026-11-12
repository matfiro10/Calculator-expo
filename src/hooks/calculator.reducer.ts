import type { Key, KeyKind } from '../keys';
import {
  Action,
  CONTINUE_ON_RESULT,
  Entry,
  Handler,
  State,
  STRUCT,
  appendEntries,
  createEntry,
  getImplicitMult,
  getLast,
  hasPrecedingOperand,
  initialState,
  isPostfixUnit,
} from './calculator.types';

function handleNumber(state: State, key: Key): State {
  const last = getLast(state);
  if (last?.math === '0' && key.math === '0' && !state.hasDot) return state;

  const needsMult = last?.type === 'CLOSE_BRACKET' || (key.isConst && hasPrecedingOperand(state));
  const newEntry  = createEntry('NUMBER', key);

  return appendEntries(
    state,
    needsMult ? [STRUCT.MULT, newEntry] : [newEntry],
    key.isConst ? { hasDot: false } : {},
  );
}

function handleDot(state: State, _key: Key): State {
  const last = getLast(state);
  if (state.hasDot || isPostfixUnit(last)) return state;

  const prefix: Entry[] = hasPrecedingOperand(state)
    ? []
    : [{ type: 'NUMBER', display: '0', math: '0' }];

  return appendEntries(state, [...prefix, STRUCT.DOT], { hasDot: true });
}

function handleInfix(state: State, key: Key): State {
  const last       = getLast(state);
  const secondLast = state.entries.at(-2);
  const newOp      = createEntry('OPERATOR', key);

  if (!last || last.type === 'OPEN_BRACKET') {
    return key.isMinus ? appendEntries(state, [newOp], { hasDot: false }) : state;
  }

  if (last.type === 'OPERATOR' && !isPostfixUnit(last)) {
    if (last.isMinus && key.isMinus) return state;

    if (last.isMinus) {
      const isLeading = !secondLast || secondLast.type === 'OPEN_BRACKET';
      if (isLeading) return state;

      const hasBinaryBefore = secondLast.type === 'OPERATOR' && !isPostfixUnit(secondLast);
      const base = hasBinaryBefore ? state.entries.slice(0, -2) : state.entries.slice(0, -1);
      return { ...state, entries: [...base, newOp], hasDot: false };
    }

    if (key.isMinus && last.allowsUnaryMinus) {
      return appendEntries(state, [newOp], { hasDot: false });
    }

    return { ...state, entries: [...state.entries.slice(0, -1), newOp], hasDot: false };
  }

  if (hasPrecedingOperand(state)) {
    return appendEntries(state, [newOp], { hasDot: false });
  }

  return state;
}

function handlePostfix(state: State, key: Key): State {
  const last = getLast(state);
  
  if (hasPrecedingOperand(state) && last?.math !== key.math) {
    return appendEntries(state, [createEntry('OPERATOR', key)], { hasDot: false });
  }
  return state;
}

function handlePrefixFn(state: State, key: Key): State {
  return appendEntries(
    state,
    [...getImplicitMult(state), createEntry('OPEN_BRACKET', key)],
    { openBracketCount: state.openBracketCount + 1, hasDot: false },
  );
}

function handleFraction(state: State, _key: Key): State {
  return appendEntries(
    state,
    [...getImplicitMult(state), { type: 'NUMBER', display: '1', math: '1' }, STRUCT.DIV],
    { hasDot: false },
  );
}

function handleBracketSmart(state: State, _key: Key): State {
  if (hasPrecedingOperand(state) && state.openBracketCount > 0) {
    return appendEntries(
      state,
      [STRUCT.CLOSE],
      { openBracketCount: state.openBracketCount - 1 },
    );
  }
  return appendEntries(
    state,
    [...getImplicitMult(state), STRUCT.OPEN],
    { openBracketCount: state.openBracketCount + 1, hasDot: false },
  );
}

function handleBackspace(state: State, _key: Key): State {
  if (state.isResult || state.entries.length === 0) return initialState;

  const removed = state.entries.at(-1)!;
  return {
    entries: state.entries.slice(0, -1),
    openBracketCount:
      removed.type === 'OPEN_BRACKET'    ? Math.max(0, state.openBracketCount - 1)
      : removed.type === 'CLOSE_BRACKET' ? state.openBracketCount + 1
      : state.openBracketCount,
    hasDot:   removed.type === 'DOT' ? false : state.hasDot,
    isResult: false,
  };
}

const HANDLERS: Record<KeyKind, Handler> = {
  number:           handleNumber,
  dot:              handleDot,
  infix_operator:   handleInfix,
  postfix_operator: handlePostfix,
  prefix_function:  handlePrefixFn,
  fraction_prefix:  handleFraction,
  bracket_smart:    handleBracketSmart,
  backspace:        handleBackspace,
  clear:            () => initialState,
  equals:           (state) => state,   
};

export function calculatorReducer(state: State, action: Action): State {
  if (action.type === 'SET_RESULT') {
    const r = action.result;
    return {
      entries: [{
        type:    'NUMBER',
        display: r.replace(/-/g, '−').replace('.', ','),
        math:    r,
      }],
      openBracketCount: 0,
      hasDot:   r.includes('.'),
      isResult: true,
    };
  }

  const handler = HANDLERS[action.key.kind];
  if (!handler) return state;

  const base = state.isResult && !CONTINUE_ON_RESULT.has(action.key.kind)
    ? initialState
    : state;

  return { ...handler(base, action.key), isResult: false };
}
