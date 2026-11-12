import { create, all, isComplex } from 'mathjs';

const math = create(all, {
  number: 'BigNumber',
  precision: 64,
});

export class ExpressionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExpressionError';
  }
}

export function evaluate(mathExpression: string): number {
  if (!mathExpression.trim()) {
    throw new ExpressionError('Wyrażenie nie może być puste');
  }

  const safeExpr = mathExpression.replace(/(\d*\.?\d+)%/g, '($1/100)');

  try {
    const rawResult = math.evaluate(safeExpr);

    if (rawResult?.isNaN?.()) {
      throw new ExpressionError('Nieprawidłowy wynik (np. 0 ÷ 0)');
    }
    if (isComplex(rawResult)) {
      throw new ExpressionError('Liczba zespolona');
    }
    if (rawResult?.isFinite?.() === false) {
      throw new ExpressionError('Nie można dzielić przez zero');
    }

    const formatted = math.format(rawResult, { precision: 14 });
    const numericResult = Number(formatted);

    if (!Number.isFinite(numericResult)) {
      throw new ExpressionError('Przekroczono maksymalny zakres liczby');
    }

    return numericResult;

  } catch (err) {
    if (err instanceof ExpressionError) throw err;

    const msg = err instanceof Error ? err.message : '';

    if (msg.includes('Unexpected end of expression') || msg.includes('Value expected')) {
      throw new ExpressionError('Niedokończone wyrażenie');
    }
    if (msg.includes('Parenthesis ) expected')) {
      throw new ExpressionError('Niedomknięty nawias');
    }

    throw new ExpressionError('Błąd składni w wyrażeniu');
  }
}
