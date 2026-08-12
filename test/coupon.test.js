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
  assert.equal(calculateDiscount(0, 'BULK25'), 0);
  assert.equal(calculateDiscount(500, 'BULK25'), 0);
  assert.equal(calculateDiscount(999, 'BULK25'), 0);
  assert.equal(calculateDiscount(999.99, 'BULK25'), 0);
  assert.equal(calculatePayable(999, 'BULK25'), 999);
  assert.equal(calculatePayable(500, 'BULK25'), 500);
});

test('BULK25 gives 25% off at threshold 1000', () => {
  assert.equal(calculateDiscount(1000, 'BULK25'), 250);
  assert.equal(calculatePayable(1000, 'BULK25'), 750);
});

test('BULK25 gives 25% off above 1000', () => {
  assert.equal(calculateDiscount(1500, 'BULK25'), 375);
  assert.equal(calculatePayable(1500, 'BULK25'), 1125);
  assert.equal(calculateDiscount(2000, 'BULK25'), 500);
  assert.equal(calculatePayable(2000, 'BULK25'), 1500);
  assert.equal(calculateDiscount(10000, 'BULK25'), 2500);
  assert.equal(calculatePayable(10000, 'BULK25'), 7500);
});

test('BULK25 handles fractional cents by rounding', () => {
  assert.equal(calculateDiscount(1001, 'BULK25'), 250.25);
  assert.equal(calculatePayable(1001, 'BULK25'), 750.75);
});

test('Issue #14: BULK25 rounds half up for fractional discount', () => {
  assert.equal(calculateDiscount(1003, 'BULK25'), 250.75);
  assert.equal(calculatePayable(1003, 'BULK25'), 752.25);
});

test('SAVE10 behavior is preserved', () => {
  assert.equal(calculateDiscount(100, 'SAVE10'), 10);
  assert.equal(calculatePayable(100, 'SAVE10'), 90);
});

test('Issue #12: BULK25 acceptance criteria', () => {
  assert.equal(calculateDiscount(1, 'BULK25'), 0);
  assert.equal(calculateDiscount(5000, 'BULK25'), 1250);
  assert.equal(calculatePayable(5000, 'BULK25'), 3750);
});
