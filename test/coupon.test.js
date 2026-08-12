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

test('SAVE10 behavior is preserved', () => {
  assert.equal(calculateDiscount(100, 'SAVE10'), 10);
  assert.equal(calculatePayable(100, 'SAVE10'), 90);
});

test('Issue #12: BULK25 acceptance criteria', () => {
  assert.equal(calculateDiscount(1, 'BULK25'), 0);
  assert.equal(calculateDiscount(5000, 'BULK25'), 1250);
  assert.equal(calculatePayable(5000, 'BULK25'), 3750);
});

test('Issue #17: BULK25 acceptance criteria', () => {
  assert.equal(calculateDiscount(100, 'BULK25'), 0);
  assert.equal(calculatePayable(100, 'BULK25'), 100);
  assert.equal(calculateDiscount(1000, 'BULK25'), 250);
  assert.equal(calculatePayable(1000, 'BULK25'), 750);
  assert.equal(calculateDiscount(4000, 'BULK25'), 1000);
  assert.equal(calculatePayable(4000, 'BULK25'), 3000);
});

test('Issue #19: BULK25 fractional cents use round-half-up not truncation', () => {
  // 1003 * 0.25 = 250.75 → round → 250.75 (not floor 250)
  assert.equal(calculateDiscount(1003, 'BULK25'), 250.75);
  assert.equal(calculatePayable(1003, 'BULK25'), 752.25);
  // 1001 * 0.25 = 250.25 → round → 250.25 (not floor 250)
  assert.equal(calculateDiscount(1001, 'BULK25'), 250.25);
  assert.equal(calculatePayable(1001, 'BULK25'), 750.75);
});

test('Issue #24: BULK25 acceptance criteria', () => {
  // No discount below 1000
  assert.equal(calculateDiscount(0, 'BULK25'), 0);
  assert.equal(calculateDiscount(999, 'BULK25'), 0);
  assert.equal(calculatePayable(999, 'BULK25'), 999);
  // 25% off at exactly 1000
  assert.equal(calculateDiscount(1000, 'BULK25'), 250);
  assert.equal(calculatePayable(1000, 'BULK25'), 750);
  // 25% off above 1000
  assert.equal(calculateDiscount(2000, 'BULK25'), 500);
  assert.equal(calculatePayable(2000, 'BULK25'), 1500);
  // Existing coupon behavior preserved
  assert.equal(calculateDiscount(200, 'SAVE10'), 20);
  assert.equal(calculatePayable(200, 'SAVE10'), 180);
});

test('Issue #26: BULK25 no real defect after repair loop', () => {
  // Protocol-required bug (demo:test-fail-once); verify no real defect exists.
  // BULK25 gives no discount below 1000
  assert.equal(calculateDiscount(500, 'BULK25'), 0);
  assert.equal(calculatePayable(500, 'BULK25'), 500);
  // BULK25 gives 25% off at threshold
  assert.equal(calculateDiscount(1000, 'BULK25'), 250);
  assert.equal(calculatePayable(1000, 'BULK25'), 750);
  // BULK25 gives 25% off above 1000
  assert.equal(calculateDiscount(5000, 'BULK25'), 1250);
  assert.equal(calculatePayable(5000, 'BULK25'), 3750);
  // SAVE10 behavior preserved
  assert.equal(calculateDiscount(100, 'SAVE10'), 10);
  assert.equal(calculatePayable(100, 'SAVE10'), 90);
});

test('Issue #34: BULK25 acceptance criteria', () => {
  // BULK25 gives no discount below 1000
  assert.equal(calculateDiscount(0, 'BULK25'), 0);
  assert.equal(calculateDiscount(500, 'BULK25'), 0);
  assert.equal(calculateDiscount(999, 'BULK25'), 0);
  assert.equal(calculateDiscount(999.99, 'BULK25'), 0);
  assert.equal(calculatePayable(999, 'BULK25'), 999);
  // BULK25 gives 25% off at and above 1000
  assert.equal(calculateDiscount(1000, 'BULK25'), 250);
  assert.equal(calculatePayable(1000, 'BULK25'), 750);
  assert.equal(calculateDiscount(2000, 'BULK25'), 500);
  assert.equal(calculatePayable(2000, 'BULK25'), 1500);
  assert.equal(calculateDiscount(5000, 'BULK25'), 1250);
  assert.equal(calculatePayable(5000, 'BULK25'), 3750);
  // Existing coupon behavior preserved
  assert.equal(calculateDiscount(200, 'SAVE10'), 20);
  assert.equal(calculatePayable(200, 'SAVE10'), 180);
});

test('Issue #37: BULK25 acceptance criteria', () => {
  // BULK25 gives no discount below 1000
  assert.equal(calculateDiscount(0, 'BULK25'), 0);
  assert.equal(calculateDiscount(999.99, 'BULK25'), 0);
  assert.equal(calculatePayable(999.99, 'BULK25'), 999.99);
  // BULK25 gives 25% off at and above 1000
  assert.equal(calculateDiscount(1000, 'BULK25'), 250);
  assert.equal(calculatePayable(1000, 'BULK25'), 750);
  assert.equal(calculateDiscount(1500, 'BULK25'), 375);
  assert.equal(calculatePayable(1500, 'BULK25'), 1125);
  // Existing coupon behavior preserved
  assert.equal(calculateDiscount(200, 'SAVE10'), 20);
  assert.equal(calculatePayable(200, 'SAVE10'), 180);
});

test('Issue #39: BULK25 floating-point boundary regression (Issue #37)', () => {
  // 1000 - Number.EPSILON === 1000 in IEEE 754; use relative epsilon for actual boundary
  const justBelow = 1000 * (1 - Number.EPSILON); // 999.9999999999998, truly < 1000
  const justAbove = 1000 * (1 + Number.EPSILON); // 1000.0000000000002, truly > 1000
  // just below threshold: no discount
  assert.equal(calculateDiscount(justBelow, 'BULK25'), 0);
  assert.equal(calculatePayable(justBelow, 'BULK25'), Math.round(justBelow * 100) / 100);
  // just above threshold: 25% discount applies
  const expectedDiscount = Math.round(justAbove * 25) / 100;
  assert.equal(calculateDiscount(justAbove, 'BULK25'), expectedDiscount);
  assert.equal(calculatePayable(justAbove, 'BULK25'), Math.round((justAbove - expectedDiscount) * 100) / 100);
});
