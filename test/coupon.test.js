import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDiscount, calculatePayable } from '../src/coupon.js';

test('SAVE10 gives ten percent off', () => {
  assert.equal(calculateDiscount(200, 'SAVE10'), 20);
  assert.equal(calculatePayable(200, 'SAVE10'), 180);
});

test('unknown coupon does not change the order', () => {
  assert.equal(calculateDiscount(200, 'UNKNOWN'), 0);
  assert.equal(calculatePayable(200, 'UNKNOWN'), 200);
});

test('negative amount is rejected', () => {
  assert.throws(() => calculateDiscount(-1, 'SAVE10'), /non-negative/);
});
