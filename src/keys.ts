export type KeyRole = 'digit' | 'operator' | 'function' | 'equals' | 'clear';

export type KeyKind =
  | 'number'
  | 'dot'
  | 'infix_operator'
  | 'postfix_operator'
  | 'prefix_function'
  | 'fraction_prefix'
  | 'bracket_smart'
  | 'backspace'
  | 'clear'
  | 'equals';

export type Key = {
  label: string;
  role: KeyRole;
  kind: KeyKind;
  value: string;
  span?: number;
  ariaLabel?: string; 
};

export const BASIC: Key[][] = [
  [
    { label: 'AC', role: 'clear',    kind: 'clear',         value: 'clear',     ariaLabel: 'Wyczyść wszystko' },
    { label: '()', role: 'operator', kind: 'bracket_smart', value: '()',        ariaLabel: 'Nawias' },
    { label: '%',  role: 'operator', kind: 'postfix_operator', value: '%',      ariaLabel: 'Procent' },
    { label: '/',  role: 'operator', kind: 'infix_operator',   value: '/',      ariaLabel: 'Dzielenie' },
  ],
  [
    { label: '7', role: 'digit',    kind: 'number',         value: '7' },
    { label: '8', role: 'digit',    kind: 'number',         value: '8' },
    { label: '9', role: 'digit',    kind: 'number',         value: '9' },
    { label: 'x', role: 'operator', kind: 'infix_operator', value: '*',      ariaLabel: 'Mnożenie' },
  ],
  [
    { label: '4', role: 'digit',    kind: 'number',         value: '4' },
    { label: '5', role: 'digit',    kind: 'number',         value: '5' },
    { label: '6', role: 'digit',    kind: 'number',         value: '6' },
    { label: '-', role: 'operator', kind: 'infix_operator', value: '-',      ariaLabel: 'Odejmowanie' },
  ],
  [
    { label: '1', role: 'digit',    kind: 'number',         value: '1' },
    { label: '2', role: 'digit',    kind: 'number',         value: '2' },
    { label: '3', role: 'digit',    kind: 'number',         value: '3' },
    { label: '+', role: 'operator', kind: 'infix_operator', value: '+',      ariaLabel: 'Dodawanie' },
  ],
  [
    { label: '0', role: 'digit',    kind: 'number',         value: '0' },
    { label: '.', role: 'digit',    kind: 'dot',            value: '.',      ariaLabel: 'Kropka dziesiętna' },
    { label: '⌫', role: 'clear',    kind: 'backspace',      value: 'backspace', ariaLabel: 'Usuń ostatni znak' },
    { label: '=', role: 'equals',   kind: 'equals',         value: '=',      ariaLabel: 'Równa się' },
  ],
];

export const EXTENDED: Key[][] = [
  [
    { label: '^2',   role: 'function', kind: 'postfix_operator', value: '^2',    ariaLabel: 'Do kwadratu' },
    { label: 'sqrt', role: 'function', kind: 'prefix_function',  value: 'sqrt(', ariaLabel: 'Pierwiastek kwadratowy' },
  ],
  [
    { label: 'x^y',  role: 'function', kind: 'infix_operator',   value: '^',     ariaLabel: 'Do potęgi' },
    { label: '1/x',  role: 'function', kind: 'fraction_prefix',  value: '1/',    ariaLabel: 'Jeden przez x' },
  ],
  [
    { label: 'pi',   role: 'digit',    kind: 'number',           value: 'pi',    ariaLabel: 'Liczba Pi' },
    { label: 'e',    role: 'digit',    kind: 'number',           value: 'e',     ariaLabel: 'Liczba Eulera' },
  ],
];