import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, ExpressionError } from './evaluate.ts';

describe('basic operations & precedence', () => {
    test('multiplication and division', () => {
        assert.equal(evaluate('3*4'), 12);
        assert.equal(evaluate('6/2'), 3);
    });

    test('multiplication and division bind tighter than addition/subtraction', () => {
        assert.equal(evaluate('2+2*2'), 6);
        assert.equal(evaluate('10-6/2'), 7);
    });

    test('parentheses override standard precedence', () => {
        assert.equal(evaluate('(2+2)*2'), 8);
    });

    test('evaluates left-to-right for same precedence operators', () => {
        assert.equal(evaluate('10-3-2'), 5);
    });
});

describe('unary signs & operators', () => {
    test('leading unary plus and minus', () => {
        assert.equal(evaluate('+5+3'), 8);
        assert.equal(evaluate('-5+3'), -2);
    });

    test('invalid leading binary operators throw error', () => {
        assert.throws(() => evaluate('*5'), ExpressionError);
        assert.throws(() => evaluate('/5'), ExpressionError);
    });

    test('consecutive binary operators throw error', () => {
        assert.throws(() => evaluate('5+*2'), ExpressionError);
        assert.throws(() => evaluate('5*/2'), ExpressionError);
    });
});

describe('decimals & precision', () => {
    test('standard decimal arithmetic without float artifacts', () => {
        assert.equal(evaluate('1.5+1'), 2.5);
        assert.equal(evaluate('0.1+0.2'), 0.3);
    });

    test('trailing and leading decimal separators', () => {
        assert.equal(evaluate('9.+1'), 10);
        assert.equal(evaluate('.5+1'), 1.5);
    });

    test('multiple decimal points in a single number throw error', () => {
        assert.throws(() => evaluate('9.9.9'), ExpressionError);
        assert.throws(() => evaluate('1..2'), ExpressionError);
    });
});

describe('errors, zero division & overflow', () => {
    test('division by zero (direct and evaluated) throws error', () => {
        assert.throws(() => evaluate('1/0'), ExpressionError);
        assert.throws(() => evaluate('1/(0.5-0.5)'), ExpressionError);
    });

    test('overflow beyond JS number limit (> 1.79e308) throws error', () => {
        assert.throws(() => evaluate('10^400'), ExpressionError);
    });

    test('empty expression throws error', () => {
        assert.throws(() => evaluate(''), ExpressionError);
    });

    test('incomplete expression throws error', () => {
        assert.throws(() => evaluate('2+'), ExpressionError);
    });

    test('unclosed parenthesis throws error', () => {
        assert.throws(() => evaluate('(2+2'), ExpressionError);
    });
});
