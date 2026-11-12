import type { Key, KeyKind } from '../keys';

export type EntryType = 'NUMBER' | 'OPERATOR' | 'DOT' | 'OPEN_BRACKET' | 'CLOSE_BRACKET';

export type Entry = {
  type:               EntryType;
  display:            string;
  math:               string;
  isMinus?:           boolean;
  allowsUnaryMinus?:  boolean;  
  isPostfix?:         boolean;  
};

export type State = {
  entries:          Entry[];
  openBracketCount: number;
  hasDot:           boolean;
  isResult:         boolean;
};

export type StateOverride = Omit<Partial<State>, 'entries'>;

export type Handler = (state: State, key: Key) => State;

export type Action =
  | { type: 'PRESS'; key: Key }
  | { type: 'SET_RESULT'; result: string };

export const initialState: State = {
  entries: [],
  openBracketCount: 0,
  hasDot: false,
  isResult: false,
};

export const STRUCT = {
  MULT:  { type: 'OPERATOR',      display: '×', math: '*' } as Entry,
  DOT:   { type: 'DOT',           display: ',', math: '.' } as Entry,
  DIV:   { type: 'OPERATOR',      display: '÷', math: '/' } as Entry,
  OPEN:  { type: 'OPEN_BRACKET',  display: '(', math: '(' } as Entry,
  CLOSE: { type: 'CLOSE_BRACKET', display: ')', math: ')' } as Entry,
} as const;

export const BACKSPACE_KEY: Key = { kind: 'backspace', label: '⌫',  display: '', math: '', role: 'clear' };
export const CLEAR_KEY:     Key = { kind: 'clear',     label: 'AC', display: '', math: '', role: 'clear' };

export const CONTINUE_ON_RESULT = new Set<KeyKind>(['infix_operator', 'postfix_operator']);

export const createEntry = (type: EntryType, key: Key): Entry => ({
  type,
  display:           key.display,
  math:              key.math,
  isMinus:           key.isMinus,
  allowsUnaryMinus:  key.allowsUnaryMinus,
  isPostfix:         key.isPostfix,
});

export const getLast = (state: State): Entry | undefined =>
  state.entries.at(-1);

export const isPostfixUnit = (entry?: Entry): boolean =>
  entry?.isPostfix === true;

export function hasPrecedingOperand(state: State): boolean {
  const last = getLast(state);
  if (!last) return false;
  return (
    last.type === 'NUMBER'        ||
    last.type === 'DOT'           ||  
    last.type === 'CLOSE_BRACKET' ||
    isPostfixUnit(last)
  );
}

export function appendEntries(
  state: State,
  newEntries: Entry[],
  overrides: StateOverride = {},
): State {
  return { ...state, ...overrides, entries: [...state.entries, ...newEntries] };
}

export const getImplicitMult = (state: State): Entry[] =>
  hasPrecedingOperand(state) ? [STRUCT.MULT] : [];
