const COUPONS = {
  SAVE10: { type: 'percent', value: 10 },
  BULK25: { type: 'percent', value: 25, minOrder: 1000 },
};

export function calculateDiscount(orderAmount, couponCode) {
  if (!Number.isFinite(orderAmount) || orderAmount < 0) {
    throw new TypeError('orderAmount must be a non-negative number');
  }
  const coupon = COUPONS[couponCode];
  if (!coupon) return 0;
  if (coupon.minOrder && orderAmount < coupon.minOrder) return 0;
  if (coupon.type === 'percent') return roundMoney(orderAmount * coupon.value / 100);
  return 0;
}

export function calculatePayable(orderAmount, couponCode) {
  return roundMoney(orderAmount - calculateDiscount(orderAmount, couponCode));
}

// Fractional cents use round-half-up (Math.round), not truncation.
function roundMoney(value) {
  return Math.round(value * 100) / 100;
}
