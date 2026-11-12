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

export type KeyRole = 'digit' | 'operator' | 'function' | 'equals' | 'clear';

export type Key = {
  label:              string;
  display:            string;
  math:               string;
  role:               KeyRole;   
  kind:               KeyKind;
  isMinus?:           boolean;    
  allowsUnaryMinus?:  boolean;   
  isPostfix?:         boolean;   
  isConst?:           boolean;    
  span?:              number;
  ariaLabel?:         string;
};

export const BASIC: Key[][] = [
  [
    { label: 'AC',  display: '',  math: '',   role: 'clear',    kind: 'clear',            ariaLabel: 'Wyczyść wszystko' },
    { label: '( )', display: '(', math: '(',  role: 'operator', kind: 'bracket_smart',    ariaLabel: 'Nawias' },
    { label: '%',   display: '%', math: '%',  role: 'operator', kind: 'postfix_operator', isPostfix: true, ariaLabel: 'Procent' },
    { label: '÷',   display: '÷', math: '/',  role: 'operator', kind: 'infix_operator',   allowsUnaryMinus: true, ariaLabel: 'Dzielenie' },
  ],
  [
    { label: '7', display: '7', math: '7', role: 'digit', kind: 'number' },
    { label: '8', display: '8', math: '8', role: 'digit', kind: 'number' },
    { label: '9', display: '9', math: '9', role: 'digit', kind: 'number' },
    { label: '×', display: '×', math: '*', role: 'operator', kind: 'infix_operator', allowsUnaryMinus: true, ariaLabel: 'Mnożenie' },
  ],
  [
    { label: '4', display: '4', math: '4', role: 'digit', kind: 'number' },
    { label: '5', display: '5', math: '5', role: 'digit', kind: 'number' },
    { label: '6', display: '6', math: '6', role: 'digit', kind: 'number' },
    { label: '−', display: '−', math: '-', role: 'operator', kind: 'infix_operator', isMinus: true, ariaLabel: 'Odejmowanie' },
  ],
  [
    { label: '1', display: '1', math: '1', role: 'digit', kind: 'number' },
    { label: '2', display: '2', math: '2', role: 'digit', kind: 'number' },
    { label: '3', display: '3', math: '3', role: 'digit', kind: 'number' },
    { label: '+', display: '+', math: '+', role: 'operator', kind: 'infix_operator', ariaLabel: 'Dodawanie' },
  ],
  [
    { label: '0', display: '0', math: '0', role: 'digit',  kind: 'number' },
    { label: ',', display: ',', math: '.', role: 'digit',  kind: 'dot',       ariaLabel: 'Przecinek dziesiętny' },
    { label: '⌫', display: '',  math: '',  role: 'clear',  kind: 'backspace', ariaLabel: 'Usuń ostatni znak' },
    { label: '=', display: '=', math: '=', role: 'equals', kind: 'equals',    ariaLabel: 'Równa się' },
  ],
];

export const EXTENDED: Key[][] = [
  [
    { label: 'x²',  display: '²',  math: '^2',    role: 'function', kind: 'postfix_operator', isPostfix: true, ariaLabel: 'Do kwadratu' },
    { label: '√x',  display: '√(', math: 'sqrt(', role: 'function', kind: 'prefix_function',               ariaLabel: 'Pierwiastek kwadratowy' },
  ],
  [
    { label: 'xʸ',  display: '^',  math: '^',  role: 'function', kind: 'infix_operator',  allowsUnaryMinus: true, ariaLabel: 'Do potęgi' },
    { label: '¹/x', display: '1/', math: '1/', role: 'function', kind: 'fraction_prefix',                 ariaLabel: 'Jeden przez x' },
  ],
  [
    { label: 'π', display: 'π', math: 'pi', role: 'digit', kind: 'number', isConst: true, ariaLabel: 'Liczba Pi' },
    { label: 'e', display: 'e', math: 'e',  role: 'digit', kind: 'number', isConst: true, ariaLabel: 'Liczba Eulera' },
  ],
];
