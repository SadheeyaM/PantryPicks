// Cart API service abstraction
export async function fetchCartList(userId: number, accessToken: string) {
  const res = await fetch(`http://localhost:3000/api/v1/carts?userId=${encodeURIComponent(String(userId))}&status=ACTIVE`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

export async function fetchCartById(cartId: number, accessToken: string) {
  const res = await fetch(`http://localhost:3000/api/v1/carts/${cartId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

export async function updateCartItemQty(cartId: number, cartItemId: number, nextQty: number, accessToken: string) {
  if (nextQty <= 0) {
    const res = await fetch(`http://localhost:3000/api/v1/carts/${cartId}/items/${cartItemId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.json();
  } else {
    const res = await fetch(`http://localhost:3000/api/v1/carts/${cartId}/items/${cartItemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ quantity: nextQty }),
    });
    return res.json();
  }
}
