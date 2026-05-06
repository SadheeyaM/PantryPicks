// Cart API service abstraction
const BFF_BASE_URL = "http://localhost:3000";

export async function fetchCart(userId: number, accessToken: string) {
  const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };
  const res = await fetch(`${BFF_BASE_URL}/api/v1/carts?userId=${encodeURIComponent(String(userId))}&status=ACTIVE`, { headers });
  return res.json();
}

export async function addToCart(cartId: number, productId: number, quantity: number, accessToken: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
  const res = await fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}/items`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
}

export async function updateCartItem(cartId: number, cartItemId: number, quantity: number, accessToken: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` };
  const res = await fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}/items/${cartItemId}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ quantity }),
  });
  return res.json();
}

export async function removeCartItem(cartId: number, cartItemId: number, accessToken: string) {
  const headers: Record<string, string> = { Authorization: `Bearer ${accessToken}` };
  const res = await fetch(`${BFF_BASE_URL}/api/v1/carts/${cartId}/items/${cartItemId}`, {
    method: 'DELETE',
    headers,
  });
  return res.json();
}
