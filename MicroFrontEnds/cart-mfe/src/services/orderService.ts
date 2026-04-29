// Order/Checkout API service abstraction
export async function confirmCheckout(cartId: number, accessToken: string, idempotencyKey: string) {
  const res = await fetch('http://localhost:3000/api/v1/orders/checkout/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ cartId }),
  });
  return res.json();
}
