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

test('BULK25 gives no discount below 1000', () => {
  assert.equal(calculateDiscount(999, 'BULK25'), 0);
  assert.equal(calculatePayable(999, 'BULK25'), 999);
});

test('BULK25 gives 25% off at 1000', () => {
  assert.equal(calculateDiscount(1000, 'BULK25'), 250);
  assert.equal(calculatePayable(1000, 'BULK25'), 750);
});

test('BULK25 gives 25% off above 1000', () => {
  assert.equal(calculateDiscount(2000, 'BULK25'), 500);
  assert.equal(calculatePayable(2000, 'BULK25'), 1500);
});
